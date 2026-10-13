'use client';

import React from 'react';
import { ShoppingBag, Star, Check, ShieldCheck, Zap, PackageCheck } from 'lucide-react';
import { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/mockData';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  return (
    <section id="products" className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-extrabold uppercase tracking-wider mb-2">
              <PackageCheck className="w-3.5 h-3.5 text-[#064E3B]" />
              Official Storefront Catalog
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Order Your GuardianTag Pack
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base font-medium">
              Free shipping across India warehouses. Includes lifetime QR ID assignment and Twilio proxy access.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>UPI, NetBanking &amp; COD Ready 🇮🇳</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map(product => {
            const isFamilyPack = product.id === 'prod-family-pack';
            return (
              <div
                key={product.id}
                className={`bg-white rounded-3xl p-6 border ${
                  isFamilyPack ? 'border-2 border-[#064E3B] shadow-lg ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-sm'
                } hover:border-[#064E3B] transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div>
                  {/* Badge & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                      isFamilyPack ? 'bg-[#FF4D4D] text-white' : 'bg-[#064E3B] text-white'
                    }`}>
                      {product.badge || 'POPULAR'}
                    </span>
                    <div className="flex items-center space-x-1 text-slate-800 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-medium">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Product Tag Graphic */}
                  <div className="w-full h-44 bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200 mb-5 group-hover:scale-[1.02] transition-transform relative overflow-hidden">
                    <div className={`w-20 h-20 rounded-2xl ${isFamilyPack ? 'bg-[#FF4D4D]' : 'bg-[#064E3B]'} p-0.5 flex items-center justify-center shadow-md`}>
                      <div className="w-full h-full bg-white rounded-xl p-2 flex flex-col items-center justify-between text-center">
                        <span className="text-[8px] font-bold text-[#064E3B]">GUARDIAN</span>
                        <span className="text-sm font-extrabold text-slate-900">{product.tagType}</span>
                        <span className="text-[8px] font-mono font-bold text-slate-400">ENCRYPTED</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#064E3B] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs font-bold text-[#064E3B] mt-1">{product.subtitle}</p>
                  <p className="text-xs text-slate-600 font-medium mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Feature Bullet Points */}
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                    {product.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Price & Add to Cart */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold text-slate-900">₹{product.price}</span>
                      <span className="text-xs text-slate-400 line-through font-semibold">₹{product.originalPrice}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off MRP</span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#04392a] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-300" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

