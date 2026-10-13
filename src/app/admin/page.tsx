'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import HardwareCard from '@/components/ui/HardwareCard';
import Badge from '@/components/ui/Badge';
import { ShoppingBag, Package, DollarSign, Phone, MapPin, Truck, RefreshCw, Layers, Trash2 } from 'lucide-react';
import { getAllOrders, updateOrderStatus, CustomerOrder } from '@/lib/orderService';
import AdminGatekeeper from '@/components/AdminGatekeeper';

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  const refreshOrders = () => {
    setOrders(getAllOrders());
  };

  useEffect(() => {
    refreshOrders();

    const handleUpdate = () => refreshOrders();
    window.addEventListener('gt_orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const interval = setInterval(() => {
      refreshOrders();
    }, 1000);

    return () => {
      window.removeEventListener('gt_orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleStatusChange = (orderId: string, newStatus: 'PENDING_DISPATCH' | 'SHIPPED' | 'DELIVERED') => {
    updateOrderStatus(orderId, newStatus);
    refreshOrders();
  };

  const handleClearOrders = () => {
    if (confirm('Clear all orders history?')) {
      localStorage.removeItem('gt_orders_db');
      refreshOrders();
    }
  };

  return (
    <AdminGatekeeper>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div className="space-y-1">
              <span className="px-3.5 py-1 rounded-full bg-white/10 text-white border border-white/20 font-mono font-bold text-xs uppercase">
                ADMIN REAL-TIME ORDERS HUB
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Customer Orders &amp; Shipping Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {orders.length > 0 && (
                <button
                  onClick={handleClearOrders}
                  className="px-3 py-2 rounded-xl bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Clear Orders</span>
                </button>
              )}

              <Button href="/admin/qr-generator" icon={<Package className="w-4 h-4" />}>
                QR Serial Generator
              </Button>
            </div>
          </div>

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="hardware-card p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>TOTAL ORDERS PLACED</span>
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white block">{orders.length}</span>
              <span className="text-[10px] text-neutral-500 block">Real-time customer orders</span>
            </div>

            <div className="hardware-card p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>PENDING DISPATCH</span>
                <Truck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-extrabold text-amber-400 block">
                {orders.filter((o) => o.shippingStatus === 'PENDING_DISPATCH').length}
              </span>
              <span className="text-[10px] text-neutral-500 block">Action required</span>
            </div>

            <div className="hardware-card p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>SHIPPED IN TRANSIT</span>
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white block">
                {orders.filter((o) => o.shippingStatus === 'SHIPPED').length}
              </span>
              <span className="text-[10px] text-neutral-500 block">In transit across India</span>
            </div>

            <div className="hardware-card p-5 rounded-2xl border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>TOTAL REVENUE</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 block">
                ₹{orders.reduce((acc, o) => acc + o.totalAmount, 0)}
              </span>
              <span className="text-[10px] text-neutral-500 block">Gross sales total</span>
            </div>
          </div>

          {/* REAL-TIME CUSTOMER ORDERS REGISTRY TABLE */}
          <HardwareCard hoverLift={false} className="border border-white/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <h3 className="text-sm font-mono font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Live Orders ({orders.length})</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Automatically updates whenever a customer places an order on the storefront.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search customer, phone, or Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black border border-white/20 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
              />
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 space-y-3 font-mono">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Customer Orders Yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Go to <Link href="/products" className="text-white underline">/products</Link> and click <strong>Buy Now</strong> to place a test order. It will appear here instantly!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/15 text-[10px] text-neutral-400 uppercase tracking-wider">
                      <th className="pb-3">ORDER ID</th>
                      <th className="pb-3">CUSTOMER &amp; MOBILE</th>
                      <th className="pb-3">ITEMS PURCHASED</th>
                      <th className="pb-3">SHIPPING ADDRESS</th>
                      <th className="pb-3">AMOUNT &amp; PAYMENT</th>
                      <th className="pb-3">FULFILLMENT STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {orders
                      .filter(
                        (o) =>
                          o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerPhone.includes(searchQuery)
                      )
                      .map((o) => (
                        <tr key={o.orderId} className="hover:bg-white/5 transition">
                          {/* Order ID */}
                          <td className="py-4 font-extrabold text-white align-top">
                            <span className="block">{o.orderId}</span>
                            <span className="text-[9px] text-neutral-500 font-normal">
                              {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Customer & Phone */}
                          <td className="py-4 text-white align-top">
                            <span className="font-bold block">{o.customerName}</span>
                            <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-white" />
                              {o.customerPhone}
                            </span>
                          </td>

                          {/* Items & Qty */}
                          <td className="py-4 text-neutral-200 align-top">
                            <span className="font-bold text-white block">
                              {o.productName} ({o.productModel})
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold inline-block mt-1">
                              QTY: {o.quantity} Pack
                            </span>
                          </td>

                          {/* Shipping Address */}
                          <td className="py-4 text-neutral-300 max-w-xs align-top">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                              <span>
                                {o.address} (PIN: <strong className="text-white">{o.pincode}</strong>)
                              </span>
                            </div>
                          </td>

                          {/* Amount & Payment */}
                          <td className="py-4 align-top">
                            <span className="font-extrabold text-white text-sm block">
                              ₹{o.totalAmount}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md inline-block mt-1 uppercase ${
                                o.paymentStatus === 'PAID'
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                              }`}
                            >
                              {o.paymentMethod} • {o.paymentStatus}
                            </span>
                          </td>

                          {/* Shipping Fulfillment Selector */}
                          <td className="py-4 align-top">
                            <select
                              value={o.shippingStatus}
                              onChange={(e) => handleStatusChange(o.orderId, e.target.value as any)}
                              className="bg-black text-white border border-white/30 rounded-xl px-2.5 py-1.5 font-bold text-xs focus:outline-none cursor-pointer"
                            >
                              <option value="PENDING_DISPATCH">PENDING DISPATCH</option>
                              <option value="SHIPPED">SHIPPED IN TRANSIT</option>
                              <option value="DELIVERED">DELIVERED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </HardwareCard>

        </main>

        <Footer />
      </div>
    </AdminGatekeeper>
  );
}
