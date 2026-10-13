import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

export interface BackendOrder {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  pincode: string;
  product_model: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  created_at: string;
}

// In-Memory Server Fallback Store for active server session
let inMemoryOrdersStore: BackendOrder[] = [];

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('customer_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Map Supabase snake_case columns to camelCase format
      const formatted = data.map((o: any) => ({
        orderId: o.order_id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        address: o.address,
        pincode: o.pincode,
        productModel: o.product_model,
        productName: o.product_name,
        quantity: o.quantity,
        totalAmount: Number(o.total_amount),
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        shippingStatus: o.shipping_status,
        createdAt: o.created_at,
      }));
      return NextResponse.json({ success: true, orders: formatted, source: 'supabase' });
    }
  } catch {
    // Fallback if table query fails
  }

  const formatted = inMemoryOrdersStore.map((o) => ({
    orderId: o.order_id,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    address: o.address,
    pincode: o.pincode,
    productModel: o.product_model,
    productName: o.product_name,
    quantity: o.quantity,
    totalAmount: Number(o.total_amount),
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    shippingStatus: o.shipping_status,
    createdAt: o.created_at,
  }));

  return NextResponse.json({ success: true, orders: formatted, source: 'memory' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerName,
      customerPhone,
      address,
      pincode,
      productModel,
      productName,
      quantity,
      totalAmount,
      paymentMethod,
      paymentStatus,
    } = body;

    const newOrder: BackendOrder = {
      order_id: orderId || 'GT-ORD-' + Math.floor(100000 + Math.random() * 900000),
      customer_name: customerName || 'Anonymous',
      customer_phone: customerPhone || '',
      address: address || '',
      pincode: pincode || '',
      product_model: productModel || 'GTB',
      product_name: productName || 'GuardianTag Hardware',
      quantity: quantity || 1,
      total_amount: totalAmount || 499,
      payment_method: paymentMethod || 'UPI',
      payment_status: paymentStatus || 'PAID',
      shipping_status: 'PENDING_DISPATCH',
      created_at: new Date().toISOString(),
    };

    inMemoryOrdersStore.unshift(newOrder);

    // Save directly to Supabase PostgreSQL Database
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from('customer_orders').insert([newOrder]);
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process order API request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, shippingStatus } = body;

    if (!orderId || !shippingStatus) {
      return NextResponse.json({ success: false, error: 'orderId and shippingStatus required' }, { status: 400 });
    }

    inMemoryOrdersStore = inMemoryOrdersStore.map((o) =>
      o.order_id === orderId ? { ...o, shipping_status: shippingStatus } : o
    );

    try {
      const supabase = getSupabaseServerClient();
      await supabase
        .from('customer_orders')
        .update({ shipping_status: shippingStatus })
        .eq('order_id', orderId);
    } catch {
      // Supabase fallback
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
