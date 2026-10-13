'use client';

export interface CustomerOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  pincode: string;
  productModel: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'COD_PENDING';
  shippingStatus: 'PENDING_DISPATCH' | 'SHIPPED' | 'DELIVERED';
  laserEtchingText?: string;
  createdAt: string;
}

const STORAGE_KEY = 'gt_orders_db';

export function getAllOrders(): CustomerOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Fallback
  }
  return [];
}

export function createOrder(newOrder: Omit<CustomerOrder, 'orderId' | 'createdAt' | 'shippingStatus'>): CustomerOrder {
  const orderId = 'GT-ORD-' + Math.floor(100000 + Math.random() * 900000);
  const created: CustomerOrder = {
    ...newOrder,
    orderId,
    shippingStatus: 'PENDING_DISPATCH',
    createdAt: new Date().toISOString(),
  };

  const current = getAllOrders();
  const updated = [created, ...current];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('gt_orders_updated'));
    window.dispatchEvent(new Event('storage'));

    // Asynchronously dispatch to Backend Database API route
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {
      // Ignore network errors on client side
    });
  }

  return created;
}

export function updateOrderStatus(orderId: string, status: 'PENDING_DISPATCH' | 'SHIPPED' | 'DELIVERED') {
  const current = getAllOrders();
  const updated = current.map((o) => (o.orderId === orderId ? { ...o, shippingStatus: status } : o));

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('gt_orders_updated'));
    window.dispatchEvent(new Event('storage'));

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, shippingStatus: status }),
    }).catch(() => {
      // Ignore network errors
    });
  }
}
