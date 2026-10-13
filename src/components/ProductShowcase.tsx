'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Camera retreat transform into Trust Section
  const retreatScale = useTransform(smoothProgress, [0.6, 0.95], [1, 0.75]);
  const retreatOpacity = useTransform(smoothProgress, [0.7, 1], [1, 0.4]);

  const angles = [
    {
      angle: 'FRONT VIEW',
      label: 'Reflective QR Core',
      detail: 'High-contrast optical QR pattern etched into polycarbonate surface.',
      spec: '30mm x 30mm Core Area',
    },
    {
      angle: 'SIDE PROFILE',
      label: 'Ultra-Slim 1.5mm',
      detail: 'Flexible, lightweight construction designed to flex around curved helmet surfaces.',
      spec: '1.5mm Total Thickness',
    },
    {
      angle: 'REAR ADHESIVE',
      label: 'Industrial 3M Layer',
      detail: 'All-weather 3M adhesive backing withstands extreme heat up to 80°C.',
      spec: '3M Heavy-Duty Bond',
    },
  ];

  return (
    <section ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            HARDWARE SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Precision Built Physical Tag.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal">
            Modular multi-angle architectural breakdown of the GuardianTag physical tag construction.
          </p>
        </div>

        {/* 3 Modular Product Visual Angle Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {angles.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="hardware-card p-8 rounded-3xl space-y-6 hover:border-white/40 transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Spec Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                    {item.angle}
                  </span>
                  <Layers className="w-4 h-4 text-neutral-400" />
                </div>

                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {item.label}
                </h3>
                <p className="text-neutral-400 text-xs font-normal leading-relaxed pt-2">
                  {item.detail}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="text-neutral-400">SPECIFICATION</span>
                <span className="text-white">{item.spec}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SHOWCASE -> TRUST TRANSITION: Product Retreat into Background */}
        <motion.div
          style={{ scale: retreatScale, opacity: retreatOpacity }}
          className="flex flex-col items-center justify-center pt-6"
        >
          <PhysicalTag3D size="md" serial="GTB-RETREAT-SPECIMEN" />
        </motion.div>

      </div>
    </section>
  );
}
