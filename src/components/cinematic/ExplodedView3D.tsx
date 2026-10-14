'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export default function ExplodedView3D() {
  const [isExploded, setIsExploded] = useState(true);

  const layers = [
    {
      id: 'L1',
      title: '01. Protective Overlaminate',
      detail: 'UV-resistant protective top film that shields against sun exposure, road rain, and scratches.',
      offsetZ: 90,
      badge: 'WEATHERPROOF SHIELD',
    },
    {
      id: 'L2',
      title: '02. High-Contrast QR Matrix',
      detail: 'Precision-printed high-contrast QR pattern calibrated for fast smartphone camera scanning in all lighting.',
      offsetZ: 30,
      badge: 'HIGH-CONTRAST QR',
    },
    {
      id: 'L3',
      title: '03. Durable Vinyl & PVC Base',
      detail: 'Flexible, tear-resistant core designed to conform smoothly to helmet curves and motorcycle surfaces.',
      offsetZ: -30,
      badge: 'DURABLE VINYL & PVC',
    },
    {
      id: 'L4',
      title: '04. Heavy-Duty 3M Adhesive',
      detail: 'All-weather high-tack 3M adhesive backing engineered to bond firmly through Indian weather conditions.',
      offsetZ: -90,
      badge: '3M ALL-WEATHER BOND',
    },
  ];

  return (
    <div className="w-full py-16 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
              MULTI-LAYER TAG ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Multi-Layer Tag Construction.
            </h2>
          </div>

          <button
            onClick={() => setIsExploded(!isExploded)}
            className="px-6 py-3 rounded-2xl bg-white text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-xl hover:bg-neutral-200 transition cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Layers className="w-4 h-4 text-black" />
            <span>{isExploded ? 'Reassemble Layers' : 'Separate Layers'}</span>
          </button>
        </div>

        {/* 3D Exploded Layer Specimen Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[480px]">
          
          {/* Left Column: 3D Exploded Layers Visualizer */}
          <div className="lg:col-span-6 flex justify-center items-center py-10 perspective-1000">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex justify-center items-center">
              {layers.map((layer, index) => {
                const zOffset = isExploded ? layer.offsetZ : 0;
                const opacity = isExploded ? 0.95 : 1 - index * 0.15;

                return (
                  <motion.div
                    key={layer.id}
                    animate={{
                      z: zOffset,
                      rotateX: isExploded ? 45 : 0,
                      rotateY: isExploded ? -25 : 0,
                      opacity,
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-3xl border-2 border-white/30 bg-black/90 p-4 shadow-2xl flex flex-col justify-between hardware-card"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-neutral-400">
                      <span className="text-white">{layer.badge}</span>
                      <span>LAYER {index + 1}/4</span>
                    </div>

                    <div className="my-auto text-center space-y-1">
                      <span className="text-xs font-mono font-extrabold text-white">
                        {layer.title}
                      </span>
                    </div>

                    <div className="text-[9px] font-mono text-neutral-500 text-right">
                      {isExploded ? 'LAYER EXPANDED' : 'ASSEMBLED'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Layer Details Accordion */}
          <div className="lg:col-span-6 space-y-4">
            {layers.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="hardware-card p-5 rounded-2xl border border-white/15 space-y-1 hover:border-white/40 transition"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-white">{l.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[9px]">
                    {l.badge}
                  </span>
                </div>
                <p className="text-neutral-400 text-xs font-normal leading-relaxed pt-1">
                  {l.detail}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
