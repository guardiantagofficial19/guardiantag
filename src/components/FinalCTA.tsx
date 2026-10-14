'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, QrCode, ShieldCheck } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Full-circle camera push-in towards GuardianTag hero hardware visual
  const tagScale = useTransform(smoothProgress, [0.1, 0.7], [0.8, 1.1]);
  const tagZ = useTransform(smoothProgress, [0.1, 0.7], [-100, 50]);

  return (
    <section ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden text-center">
      
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

        {/* FULL-CIRCLE CAMERA PUSH-IN: Returning 3D GuardianTag Visual */}
        <motion.div
          style={{ scale: tagScale, z: tagZ }}
          className="py-4 flex justify-center items-center"
        >
          <PhysicalTag3D size="xl" serial="GTB0001" tagType="GTB" />
        </motion.div>

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
