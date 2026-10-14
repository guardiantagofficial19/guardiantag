'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Bike, Baby, Briefcase, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function ProductCategories() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Zoom into QR transition bridging toward How It Works (PRODUCT -> QR -> SCAN)
  const qrZoomScale = useTransform(smoothProgress, [0.6, 0.95], [1, 2.8]);
  const qrOpacity = useTransform(smoothProgress, [0.6, 0.9, 1], [1, 0.95, 0.3]);

  const products = [
    {
      id: 'GTB' as const,
      name: 'GTB Biker',
      subtitle: 'Helmet & Motorcycle Safety',
      description: 'Ultra-durable weatherproof vinyl & PVC tag designed for helmets and motorbikes. Instant accident emergency connection.',
      icon: Bike,
      badge: 'Available Now — ₹499',
    },
    {
      id: 'GTK' as const,
      name: 'GTK Kids Bundle',
      subtitle: 'Complete 10-Piece Child Safety Kit',
      description: 'Includes 4 small stickers, 1 key tag, 1 badge & 4 iron-on clothing stickers for full school & daily protection.',
      icon: Baby,
      badge: 'Coming Soon',
    },
    {
      id: 'GTT' as const,
      name: 'GTT Traveller',
      subtitle: 'Luggage & Airport Bag Return',
      description: 'Heavy-duty luggage loop tag with steel wire connector. Enables airport return without exposing home address.',
      icon: Briefcase,
      badge: 'Coming Soon',
    },
    {
      id: 'GTU' as const,
      name: 'GTU Universal',
      subtitle: 'Vehicle, Keys & Asset Security',
      description: 'Versatile outdoor adhesive decal for cars, two-wheelers, laptops, and keychains with high-vis warning pattern.',
      icon: Car,
      badge: 'Coming Soon',
    },
  ];

  return (
    <section id="products" ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hardware Form Factors</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Engineered for Every Use Case.
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl font-normal">
              Four specialized physical GuardianTag categories calibrated for bikes, kids, travel, and everyday belongings.
            </p>
          </div>

          <a
            href="#products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-white hover:text-neutral-300 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Product Cards Grid with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="hardware-card p-6 rounded-3xl relative flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20 uppercase">
                      {product.badge}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  {/* 3D Hardware Miniature Render */}
                  <div className="my-4 flex justify-center">
                    <PhysicalTag3D tagType={product.id} size="sm" serial={`${product.id}-001`} />
                  </div>

                  {/* Card Content */}
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-widest block uppercase">
                      {product.id} SPECIMEN
                    </span>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-300">
                      {product.subtitle}
                    </p>
                    <p className="text-neutral-400 text-xs font-normal leading-relaxed pt-1">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-400">STATUS: READY</span>
                  <span className="text-xs font-extrabold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* TRANSITION ANCHOR: Product -> QR -> Scan Camera Push into How It Works */}
        <motion.div
          style={{ scale: qrZoomScale, opacity: qrOpacity }}
          className="flex flex-col items-center justify-center pt-8 text-center"
        >
          <div className="p-4 rounded-3xl bg-black border border-white/20 shadow-2xl relative">
            <PhysicalTag3D size="md" serial="GTB-SCAN-TRANSITION" />
          </div>
          <p className="text-xs font-mono font-extrabold text-neutral-400 uppercase tracking-widest pt-4">
            ZOOMING INTO OPTICAL QR CORE...
          </p>
        </motion.div>

      </div>
    </section>
  );
}
