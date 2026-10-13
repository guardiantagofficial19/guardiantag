'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Zap, Lock, BatteryCharging, Radio, EyeOff, Layers, Cpu } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function FeatureGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Horizontal bridging transition into Use Cases
  const productX = useTransform(smoothProgress, [0.4, 0.95], ['-30%', '30%']);
  const productScale = useTransform(smoothProgress, [0.5, 0.9], [0.9, 1.1]);

  const features = [
    {
      icon: EyeOff,
      title: 'Zero PII Exposure',
      description: 'Owner numbers & contact details are stored securely server-side. Scanner pages display zero phone numbers.',
    },
    {
      icon: BatteryCharging,
      title: 'Zero Charging Required',
      description: 'Passive optical QR technology requires no batteries, cables, or power maintenance ever.',
    },
    {
      icon: Radio,
      title: 'No App Download Needed',
      description: 'Bystanders interact via native iOS or Android camera scanners using standard web protocols.',
    },
    {
      icon: Layers,
      title: '3M Polycarbonate Core',
      description: 'High-visibility reflective core bonded with 3M heavy-duty waterproof adhesive.',
    },
    {
      icon: Lock,
      title: 'PBKDF2/SHA-512 PIN Protection',
      description: 'Owner management portal protected with 10,000-iteration PBKDF2 PIN hashing.',
    },
    {
      icon: Zap,
      title: 'Instant Proxy Call Relay',
      description: 'Twilio voice proxy bridges caller to owner instantly without exposing either line.',
    },
  ];

  return (
    <section id="features" ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      
      {/* Background Soft Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            HARDWARE ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineered without compromise.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal">
            Every layer of GuardianTag is optimized for harsh Indian road conditions, total privacy, and instant emergency dispatch.
          </p>
        </div>

        {/* 6 Grid Cards with Staggered Reveals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="hardware-card p-8 rounded-3xl space-y-4 hover:border-white/40 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg mb-6">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-sm font-normal leading-relaxed pt-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>HARDWARE SPEC</span>
                  <span className="font-bold text-white">VERIFIED</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* VISUAL BRIDGE: GuardianTag Product Moving Horizontally into Use Cases */}
        <motion.div
          style={{ x: productX, scale: productScale }}
          className="flex justify-center items-center pt-8"
        >
          <PhysicalTag3D size="lg" serial="GTU-BRIDGE-01" tagType="GTU" />
        </motion.div>

      </div>
    </section>
  );
}
