import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const GUARDIANTAG_WHATSAPP_NUMBER = '918058800880';

// Mapping from catalog product ID to store_products SKU
const SKU_MAP: Record<string, string> = {
  GTB: 'GTB-KIT',
  GTK: 'GTK-KIT',
  GTT: 'GTT-KIT',
  GTU: 'GTU-KIT',
};

export async function GET() {
  try {
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch store orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productModel,
      productName,
      quantity = 1,
      totalAmount,
      customerName,
      customerPhone,
      customerEmail,
      address,
      city = 'India',
      state = '',
      pincode = '',
      laserEtchingText,
      notes,
    } = body;

    if (!customerName || !customerPhone || !address) {
      return NextResponse.json(
        { success: false, error: 'Customer Name, Phone number, and Address are required.' },
        { status: 400 }
      );
    }

    const sku = SKU_MAP[productModel] || 'GTB-KIT';
    const qty = Math.max(1, Number(quantity) || 1);
    const amountInPaise = totalAmount ? Math.round(Number(totalAmount) * 100) : 49900;
    const orderId = crypto.randomUUID();

    const orderNotes = [
      laserEtchingText ? `Etching: ${laserEtchingText}` : '',
      notes ? notes : '',
    ].filter(Boolean).join(' | ');

    // 1. Insert order into store_orders and store_order_items
    // 2. Decrement stock from store_products and log movement
    const stmts = [
      sql`
        INSERT INTO store_orders (
          id,
          customer_name,
          phone,
          email,
          address,
          city,
          state,
          pincode,
          status,
          payment_status,
          shipping_paise,
          total_paise,
          notes
        ) VALUES (
          ${orderId},
          ${String(customerName).trim()},
          ${String(customerPhone).trim()},
          ${String(customerEmail || '').trim()},
          ${String(address).trim()},
          ${String(city).trim()},
          ${String(state).trim()},
          ${String(pincode).trim()},
          'new',
          'unpaid',
          0,
          ${amountInPaise},
          ${orderNotes}
        )
      `,
      sql`
        INSERT INTO store_order_items (
          order_id,
          sku,
          name,
          qty,
          unit_paise
        ) VALUES (
          ${orderId},
          ${sku},
          ${productName || 'GTB Biker Tag Kit (4-piece)'},
          ${qty},
          ${Math.round(amountInPaise / qty)}
        )
      `,
      sql`
        UPDATE store_products 
        SET stock = GREATEST(0, stock - ${qty}) 
        WHERE sku = ${sku}
      `,
      sql`
        INSERT INTO stock_movements (
          sku,
          delta,
          reason,
          order_id
        ) VALUES (
          ${sku},
          ${-qty},
          'website_order',
          ${orderId}
        )
      `,
    ];

    await sql.transaction(stmts);

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
    } catch {
      // Revalidation is non-blocking
    }

    // 3. Format WhatsApp Details message for customer & merchant
    const totalRupees = Math.round(amountInPaise / 100);
    const whatsappMessage = [
      `🚨 *NEW GUARDIANTAG ORDER: ${orderNo}*`,
      `━━━━━━━━━━━━━━━━━━`,
      `📦 *Item:* ${productName || 'GTB Biker Tag Kit'} (Qty: ${qty})`,
      `💰 *Total Amount:* ₹${totalRupees} (Free Delivery Across India)`,
      orderNotes ? `🏷️ *Custom Details:* ${orderNotes}` : '',
      ``,
      `👤 *Customer Info:*`,
      `• Name: ${customerName}`,
      `• Mobile: ${customerPhone}`,
      customerEmail ? `• Email: ${customerEmail}` : '',
      `📍 *Delivery Address:*`,
      `${address}${pincode ? ` - ${pincode}` : ''}`,
      `━━━━━━━━━━━━━━━━━━`,
      `✅ *Status:* Order registered in Store Manager. Please confirm delivery/payment.`
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/${GUARDIANTAG_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      success: true,
      orderId,
      orderNo,
      totalRupees,
      whatsappUrl,
      whatsappMessage,
      message: 'Order placed successfully and synced with Store Manager.',
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to place order in Store Manager database' },
      { status: 500 }
    );
  }
}
