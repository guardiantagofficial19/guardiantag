import { errorMessage } from '@/lib/errors';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { COOKIE, verifyToken } from '@/lib/admin-auth';
import { isRateLimited } from '@/lib/security/rateLimit';

const GUARDIANTAG_WHATSAPP_NUMBER = '918058800880';

// Mapping from catalog product ID to store_products SKU
const SKU_MAP: Record<string, string> = {
  GTB: 'GTB-KIT',
  GTK: 'GTK-KIT',
  GTT: 'GTT-KIT',
  GTU: 'GTU-KIT',
};

// Protected: Only authorized Store Manager administrators can fetch full order records
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!(await verifyToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await sql`
      SELECT
        o.id,
        o.order_no,
        o.customer_name,
        o.phone,
        o.email,
        o.address,
        o.city,
        o.state,
        o.pincode,
        o.status,
        o.payment_status,
        o.total_paise,
        o.notes,
        o.created_at,
        (SELECT COALESCE(sum(qty), 0)::int FROM store_order_items i WHERE i.order_id = o.id) AS units,
        (SELECT json_agg(json_build_object('sku', i.sku, 'name', i.name, 'qty', i.qty, 'unit_paise', i.unit_paise))
         FROM store_order_items i WHERE i.order_id = o.id) AS items
      FROM store_orders o
      ORDER BY o.created_at DESC
      LIMIT 100
    `;
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: errorMessage(error) || 'Failed to fetch store orders' },
      { status: 500 }
    );
  }
}

type Discount = { id: string; code: string; discount_type: string; value: number; min_spend_paise: number };

/** Server-side coupon check against the database. Returns the coupon or a customer-facing error. */
async function loadDiscount(code: string, subtotalPaise: number): Promise<{ discount: Discount } | { error: string }> {
  const rows = await sql`
    SELECT id, code, discount_type, value, min_spend_paise, usage_count, max_uses, active, starts_at, expires_at
    FROM store_discounts WHERE UPPER(code) = ${code} LIMIT 1`;
  const d = rows[0];
  if (!d) return { error: 'Invalid discount code.' };
  if (!d.active || (d.starts_at && new Date(d.starts_at).getTime() > Date.now())) return { error: 'This discount code is not active.' };
  if (d.expires_at && new Date(d.expires_at).getTime() < Date.now()) return { error: 'This coupon code has expired.' };
  if (d.max_uses !== null && Number(d.usage_count) >= Number(d.max_uses)) return { error: 'This coupon has reached its maximum usage limit.' };
  if (Number(d.min_spend_paise) > 0 && subtotalPaise < Number(d.min_spend_paise)) {
    return { error: `Minimum order amount of ₹${Math.round(Number(d.min_spend_paise) / 100)} required for this coupon.` };
  }
  return { discount: { id: String(d.id), code: String(d.code), discount_type: String(d.discount_type), value: Number(d.value), min_spend_paise: Number(d.min_spend_paise) } };
}

function discountAmount(d: Discount | null, subtotalPaise: number): number {
  if (!d) return 0;
  if (d.discount_type === 'percentage') return Math.min(subtotalPaise, Math.round((subtotalPaise * d.value) / 100));
  if (d.discount_type === 'fixed_amount') return Math.min(subtotalPaise, d.value);
  return 0; // free_shipping: delivery is already free
}

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1').slice(0, 100);
    // Max 6 orders per IP per 10 minutes (stored in the database, so it holds across instances).
    if (await isRateLimited(`order-ip:${ip}`, 6, 10 * 60)) {
      return NextResponse.json(
        { success: false, error: 'Too many order requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      productModel,
      quantity = 1,
      customerName,
      customerPhone,
      customerEmail,
      address,
      city = 'India',
      state = '',
      pincode = '',
      laserEtchingText,
      notes,
      discountCode,
    } = body;

    const cleanName = String(customerName || '').trim().slice(0, 100);
    const cleanPhone = String(customerPhone || '').trim().slice(0, 20);
    const cleanAddress = String(address || '').trim().slice(0, 500);
    const cleanEmail = String(customerEmail || '').trim().slice(0, 100);
    const cleanCity = String(city || 'India').trim().slice(0, 100);
    const cleanState = String(state || '').trim().slice(0, 100);
    const cleanPincode = String(pincode || '').trim().slice(0, 15);
    const cleanEtching = String(laserEtchingText || '').trim().slice(0, 60);
    const cleanNotes = String(notes || '').trim().slice(0, 300);
    const cleanCode = String(discountCode || '').trim().toUpperCase().slice(0, 40);

    if (!cleanName || !cleanPhone || !cleanAddress) {
      return NextResponse.json(
        { success: false, error: 'Customer Name, Phone number, and Address are required.' },
        { status: 400 }
      );
    }

    const sku = SKU_MAP[String(productModel || '').toUpperCase()];
    if (!sku) {
      return NextResponse.json({ success: false, error: 'Unknown product.' }, { status: 400 });
    }
    const parsedQty = Math.max(1, Math.min(25, Math.trunc(Number(quantity) || 1)));

    // 1. Price comes from the database, never from the client.
    const productRows = await sql`SELECT name, price_paise, stock, active FROM store_products WHERE sku = ${sku} LIMIT 1`;
    const product = productRows[0];
    if (!product || !product.active) {
      return NextResponse.json({ success: false, error: 'This product is not available to order yet.' }, { status: 400 });
    }
    if (Number(product.stock) < parsedQty) {
      const left = Number(product.stock);
      return NextResponse.json(
        { success: false, error: left > 0 ? `Only ${left} left in stock. Please lower the quantity.` : 'This product is out of stock.' },
        { status: 409 }
      );
    }

    const unitPaise = Number(product.price_paise);
    const subtotalPaise = unitPaise * parsedQty;

    // 2. Coupon is re-validated and priced on the server.
    let discount: Discount | null = null;
    if (cleanCode) {
      const res = await loadDiscount(cleanCode, subtotalPaise);
      if ('error' in res) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      discount = res.discount;
    }
    const discountPaise = discountAmount(discount, subtotalPaise);
    const totalPaise = Math.max(0, subtotalPaise - discountPaise);
    const productName = String(product.name);
    const orderId = crypto.randomUUID();

    const orderNotes = [
      cleanEtching ? `Etching: ${cleanEtching}` : '',
      discount ? `Coupon: ${discount.code} (-₹${Math.round(discountPaise / 100)})` : '',
      cleanNotes,
    ].filter(Boolean).join(' | ');

    // 3. One transaction. CHECK constraints (stock >= 0, usage_count <= max_uses) abort it
    //    if a concurrent order took the last unit or the last coupon use.
    const stmts = [
      sql`UPDATE store_products SET stock = stock - ${parsedQty} WHERE sku = ${sku}`,
      ...(discount ? [sql`UPDATE store_discounts SET usage_count = usage_count + 1 WHERE id = ${discount.id}::uuid`] : []),
      sql`
        INSERT INTO store_orders (
          id, customer_name, phone, email, address, city, state, pincode,
          status, payment_status, shipping_paise, total_paise, notes
        ) VALUES (
          ${orderId}, ${cleanName}, ${cleanPhone}, ${cleanEmail}, ${cleanAddress}, ${cleanCity}, ${cleanState}, ${cleanPincode},
          'new', 'unpaid', 0, ${totalPaise}, ${orderNotes}
        )
      `,
      sql`
        INSERT INTO store_order_items (order_id, sku, name, qty, unit_paise)
        VALUES (${orderId}, ${sku}, ${productName}, ${parsedQty}, ${unitPaise})
      `,
      sql`
        INSERT INTO stock_movements (sku, delta, reason, order_id)
        VALUES (${sku}, ${-parsedQty}, 'website_order', ${orderId})
      `,
    ];

    try {
      await sql.transaction(stmts);
    } catch (e) {
      const msg = errorMessage(e);
      if (/store_products_stock_check/.test(msg)) {
        return NextResponse.json({ success: false, error: 'Sorry, this item just sold out. Please lower the quantity or try later.' }, { status: 409 });
      }
      if (/store_discounts_usage_within_max/.test(msg)) {
        return NextResponse.json({ success: false, error: 'This coupon has just reached its usage limit.' }, { status: 409 });
      }
      throw e;
    }

    // Fetch the auto-generated order_no (e.g. GT-1002)
    const result = await sql`
      SELECT order_no, created_at FROM store_orders WHERE id = ${orderId} LIMIT 1
    `;
    const orderNo = result[0]?.order_no || `GT-${orderId.slice(0, 8).toUpperCase()}`;

    // Revalidate Store Manager pages so the new order reflects immediately
    try {
      revalidatePath('/admin');
      revalidatePath('/admin/orders');
      revalidatePath('/admin/inventory');
      if (discount) revalidatePath('/admin/discounts');
    } catch {
      // Revalidation is non-blocking
    }

    // 4. WhatsApp message for customer & merchant (server-computed figures only)
    const totalRupees = Math.round(totalPaise / 100);
    const whatsappMessage = [
      `🚨 *NEW GUARDIANTAG ORDER: ${orderNo}*`,
      `━━━━━━━━━━━━━━━━━━`,
      `📦 *Item:* ${productName} (Qty: ${parsedQty})`,
      discount ? `🏷️ *Coupon:* ${discount.code} (-₹${Math.round(discountPaise / 100)})` : '',
      `💰 *Total Amount:* ₹${totalRupees} (Free Delivery Across India)`,
      cleanEtching ? `✏️ *Custom Etching:* ${cleanEtching}` : '',
      ``,
      `👤 *Customer Info:*`,
      `• Name: ${cleanName}`,
      `• Mobile: ${cleanPhone}`,
      cleanEmail ? `• Email: ${cleanEmail}` : '',
      `📍 *Delivery Address:*`,
      `${cleanAddress}${cleanPincode ? ` - ${cleanPincode}` : ''}`,
      `━━━━━━━━━━━━━━━━━━`,
      `✅ *Status:* Order registered in Store Manager. Please confirm delivery/payment.`
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/${GUARDIANTAG_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      success: true,
      orderId,
      orderNo,
      subtotalRupees: Math.round(subtotalPaise / 100),
      discountRupees: Math.round(discountPaise / 100),
      totalRupees,
      whatsappUrl,
      whatsappMessage,
      message: 'Order placed successfully and synced with Store Manager.',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to place your order. Please try again or order on WhatsApp.' },
      { status: 500 }
    );
  }
}
