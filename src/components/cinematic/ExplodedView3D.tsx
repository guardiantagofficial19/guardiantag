'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

// `look` gives each layer a distinct material so the stack reads clearly in the 3D view.
const layers = [
  {
    id: 'L1',
    title: 'Protective overlaminate',
    detail: 'A UV-resistant top film that shields the print from sun, rain and scratches.',
    offsetZ: 90,
    look: 'bg-white/[0.06] border-white/50 backdrop-blur-[2px] text-white',
  },
  {
    id: 'L2',
    title: 'High-contrast QR print',
    detail: 'Printed for fast scanning by any phone camera, in daylight or under headlights.',
    offsetZ: 30,
    look: 'bg-white border-white text-black',
  },
  {
    id: 'L3',
    title: 'Vinyl and PVC core',
    detail: 'Flexible and tear-resistant, so it follows helmet curves and bike panels.',
    offsetZ: -30,
    look: 'bg-yellow-400 border-yellow-300 text-black',
  },
  {
    id: 'L4',
    title: 'Sticky backing',
    detail: 'Peel off the liner and stick it on your helmet, bike, keys, bag, anywhere.',
    offsetZ: -90,
    look: 'bg-neutral-800 border-neutral-600 text-neutral-200',
  },
];

export default function ExplodedView3D() {
  const [isExploded, setIsExploded] = useState(true);

  return (
    <section id="build" className={SECTION_CLASS}>
      <div className={`${CONTAINER_CLASS} space-y-12`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <SectionHeader
            align="left"
            eyebrow="Build quality"
            title="Four layers."
            muted="Made for Indian roads."
            intro="Each tag is laminated in layers, so the code stays readable after years of sun, rain and washing."
          />
          <button
            type="button"
            onClick={() => setIsExploded(!isExploded)}
            className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition cursor-pointer flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>{isExploded ? 'Put layers together' : 'Separate layers'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 3D layer visual */}
          <div className="lg:col-span-6 flex justify-center items-center py-10" aria-hidden="true">
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 flex justify-center items-center"
              style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
            >
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  animate={{
                    // Exploded: layers fan out vertically in an isometric view. Assembled: one stacked tag.
                    y: isExploded ? (index - 1.5) * 70 : index * 3,
                    rotateX: isExploded ? 58 : 0,
                    rotateZ: isExploded ? -32 : 0,
                    scale: isExploded ? 0.8 : 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-56 h-36 sm:w-64 sm:h-40 rounded-2xl border p-4 shadow-2xl shadow-black/60 flex items-end justify-between ${layer.look}`}
                  style={{ zIndex: layers.length - index }}
                >
                  <span className="text-xs font-semibold">{layer.title}</span>
                  <span className="text-xs font-mono font-bold tabular-nums opacity-70">{index + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Layer details */}
          <ol className="lg:col-span-6 space-y-3">
            {layers.map((l, i) => (
              <motion.li
                key={l.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="hardware-card p-5 rounded-2xl flex gap-4"
              >
                <span className="w-8 h-8 shrink-0 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-bold flex items-center justify-center tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{l.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed pt-1">{l.detail}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
