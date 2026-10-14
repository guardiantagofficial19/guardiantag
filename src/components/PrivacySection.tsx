'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Lock, EyeOff, ShieldCheck, FileCheck } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function PrivacySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Camera rotation around edge of tag transition into Product Showcase
  const tagRotateY = useTransform(smoothProgress, [0.5, 0.95], ['-35deg', '35deg']);
  const tagScale = useTransform(smoothProgress, [0.5, 0.9], [0.9, 1.15]);

  const points = [
    {
      icon: EyeOff,
      title: 'Number Masking',
      description: 'Your real 10-digit mobile number is never printed on the tag or exposed on the web scanner page.',
    },
    {
      icon: Lock,
      title: 'Minimal Data Exposure',
      description: 'Only emergency contacts and vehicle info you explicitly choose to share are accessible to scanners.',
    },
    {
      icon: ShieldCheck,
      title: 'No App Tracking',
      description: 'Scanners interact purely through standard web browser sessions. No background location tracking or app downloads.',
    },
    {
      icon: FileCheck,
      title: 'Owner Controlled',
      description: 'You can update, disable, or modify emergency contacts at any time from your GuardianTag management page.',
    },
  ];

  return (
    <section ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      
      {/* Soft Calm Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-white/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Slow Typography Mask Reveals */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            PRIVACY &amp; ANONYMITY PROTOCOL
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Safety without giving away your privacy.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal">
            GuardianTag bridges communication between strangers during emergencies while keeping your personal data secure.
          </p>
        </motion.div>

        {/* 4 Privacy Feature Columns with Staggered Fade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="hardware-card p-6 rounded-3xl space-y-4 hover:border-white/40 transition duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-wide">
                  {p.title}
                </h3>
                <p className="text-neutral-400 text-xs font-normal leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* PRIVACY -> SHOWCASE TRANSITION: Edge Light & Slow Camera Rotation */}
        <div className="flex flex-col items-center justify-center pt-8">
          <motion.div style={{ rotateY: tagRotateY, scale: tagScale }}>
            <PhysicalTag3D size="lg" serial="GTB0001" />
          </motion.div>
          <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-widest pt-4 uppercase">
            360° PHYSICAL HARDWARE PERSPECTIVE
          </span>
        </div>

      </div>
    </section>
  );
}
