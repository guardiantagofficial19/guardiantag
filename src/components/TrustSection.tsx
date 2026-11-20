'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BatteryCharging, Smartphone, Lock, ShieldCheck } from 'lucide-react';

export default function TrustSection() {
  const trustPoints = [
    {
      title: 'Battery-Free',
      description: 'Zero charging or battery replacement required.',
      icon: BatteryCharging,
    },
    {
      title: 'No App Required',
      description: 'Works instantly on any mobile device with a camera.',
      icon: Smartphone,
    },
    {
      title: 'Privacy Focused',
      description: 'Private phone numbers remain hidden from public web scanners.',
      icon: Lock,
    },
    {
      title: 'Built for Everyday Safety',
      description: 'Durable materials engineered for helmets, travel, and belongings.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 bg-black text-white border-b border-white/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            PRODUCT PROMISE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Designed for Real-World Reliability.
          </h2>
        </div>

        {/* 4 Product Promise Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="hardware-card p-6 rounded-2xl text-center space-y-3 hover:border-white/40 transition duration-300"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
