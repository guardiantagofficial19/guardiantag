'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, QrCode } from 'lucide-react';
import { CONTAINER_CLASS } from '@/components/ui/SectionHeader';

export default function FinalCTA() {
  return (
    <section className="relative bg-black text-white py-20 sm:py-28 border-b border-white/10">
      <div className={CONTAINER_CLASS}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-neutral-950 px-6 py-14 sm:px-12 sm:py-20 text-center">
          {/* Soft yellow glow behind the panel */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[360px] rounded-full bg-yellow-400/15 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-yellow-400">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" aria-hidden="true" />
              Ride with GuardianTag
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05] text-balance">
              Keep what matters connected.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              Nothing to charge, nothing for a stranger to install. Just help, one scan away.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-base shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2"
              >
                Order the Biker Kit — ₹499
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Activate your tag
              </Link>
            </div>
            <p className="text-xs text-neutral-500">Free delivery across India · 7-day replacement</p>
          </div>
        </div>
      </div>
    </section>
  );
}
