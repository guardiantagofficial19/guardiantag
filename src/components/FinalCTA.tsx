'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, QrCode, ShieldCheck } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden text-center">
      
      {/* Radial Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Full-Circle Return Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>START YOUR EMERGENCY PROTECTION</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Keep what matters connected.
        </h2>

        <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Zero batteries to charge. Zero app downloads for scanners. Instant emergency reach when every second counts.
        </p>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-white hover:bg-neutral-200 text-black font-extrabold text-base shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Order Biker Kit — ₹499</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 transition flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5 text-white" />
            <span>Activate Your Tag</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
