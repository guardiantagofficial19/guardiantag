'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, QrCode } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for cinematic camera pushback
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // 3D Perspective pushback transforms
  const tagScale = useTransform(smoothProgress, [0, 0.8], [1, 0.65]);
  const tagOpacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.9, 0.2]);
  const tagZ = useTransform(smoothProgress, [0, 1], [0, -250]);
  const textY = useTransform(smoothProgress, [0, 0.8], [0, -60]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] sm:min-h-[100vh] flex flex-col justify-center items-center bg-black text-white overflow-hidden pt-28 sm:pt-32 pb-16 border-b border-white/15"
    >
      {/* Radial Soft White Ambient Glow Background */}
      <motion.div
        style={{ scale: tagScale, opacity: tagOpacity }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-white/10 rounded-full blur-[160px] pointer-events-none -z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-6 sm:space-y-7">
        {/* GT Shield Logo + ULTRA-TALL CONDENSED DISPLAY HEADLINE */}
        <motion.div style={{ y: textY }} className="py-2 flex flex-col items-center">
          {/* Official GT Shield Logo */}
          <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-4 sm:mb-5 flex items-center justify-center">
            <Image
              src="/gt-logo.png"
              alt="GuardianTag GT Shield Logo"
              width={463}
              height={497}
              sizes="144px"
              preload
              className="w-full h-full object-contain filter brightness-0 invert drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            />
          </div>

          <h1 className="font-bebas text-6xl sm:text-8xl md:text-9xl lg:text-[140px] leading-[0.88] tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase drop-shadow-2xl select-none">
            GUARDIANTAG
            <span className="sr-only"> — emergency QR safety tags for bikers</span>
          </h1>
        </motion.div>

        {/* Subtitle Headline */}
        <p className="text-lg sm:text-2xl lg:text-3xl text-neutral-300 font-mono font-bold tracking-wider max-w-3xl mx-auto leading-relaxed uppercase">
          Scan | Connect | Return
        </p>

        {/* Value proposition: what it is, in one sentence */}
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          An emergency QR tag for your helmet. Anyone who scans it can call your family in seconds,
          with <span className="text-white font-semibold">no app and your number kept hidden</span>.
        </p>

        {/* Centered Pill Action Buttons (above the tag, so they are visible without scrolling) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm sm:text-base shadow-lg shadow-yellow-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Buy Biker Tag — ₹499</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 transition flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5 text-white" />
            <span>Activate Tag</span>
          </Link>
        </div>

        {/* Value Micro-Copy */}
        <p className="text-xs font-mono text-neutral-400 font-medium tracking-wider uppercase">
          Zero Yearly Subscription • 3-5 Days Delivery Across India • 7-Day Replacement
        </p>

        {/* Centered 3D GuardianTag Specimen with Perspective Camera Pushback */}
        <motion.div
          style={{
            scale: tagScale,
            opacity: tagOpacity,
            z: tagZ,
          }}
          className="pt-4 pb-2 flex justify-center items-center"
        >
          <PhysicalTag3D serial="GTB0001" tagType="GTB" size="lg" />
        </motion.div>

      </div>
    </section>
  );
}
