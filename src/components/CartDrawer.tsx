'use client';

import React from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between text-slate-900 shadow-2xl">
        
        {/* Cart Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Safety Cart</h3>
              <p className="text-xs text-slate-500">Medusa Storefront Checkout</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 py-12">
              <ShoppingBag className="w-12 h-12 text-slate-300 stroke-[1.5]" />
              <p className="font-bold text-slate-700">Your cart is currently empty.</p>
              <p className="text-xs text-slate-400 max-w-xs">Select GTB, GTK, GTT, or GTU tags from the catalog to add them to your order.</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.product.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-orange-600 text-xs shadow-2xs">
                    {item.product.tagType}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.product.title}</h4>
                    <p className="text-xs font-bold text-orange-600">₹{item.product.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="p-1 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Across India</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Order initiated for ₹${total}! Redirecting to Medusa / Razorpay Gateway...`)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition"
            >
              <span>Proceed to Checkout (₹{total})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
