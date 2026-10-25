'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, ShieldCheck, ArrowRight } from 'lucide-react';

export default function StoreManagerSideButton() {
  const pathname = usePathname();

  // Hide on admin routes to prevent duplicate UI within the admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <aside aria-label="Store Manager Quick Access" className="fixed right-0 top-1/2 -translate-y-1/2 z-[9990] select-none">
      <Link
        href="/admin"
        aria-label="Open Store Manager"
        className="group flex items-center bg-black/90 hover:bg-neutral-900 text-white border-l border-y border-white/20 hover:border-emerald-400/80 rounded-l-2xl pl-3.5 pr-3 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 cursor-pointer"
        title="Open GuardianTag Store Manager"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest leading-none">
              ADMIN
            </span>
            <span className="text-xs font-mono font-extrabold text-white tracking-wide mt-0.5 group-hover:text-emerald-300 transition-colors">
              Store Manager
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </Link>
    </aside>
  );
}
