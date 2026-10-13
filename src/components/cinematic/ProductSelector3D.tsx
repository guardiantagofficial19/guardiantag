'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Baby, Briefcase, Car, ArrowRight, CheckCircle2 } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import { soundEngine } from '@/lib/soundEngine';

export default function ProductSelector3D() {
  const [selectedId, setSelectedId] = useState<'GTB' | 'GTK' | 'GTT' | 'GTU'>('GTB');

  const products = [
    {
      id: 'GTB' as const,
      name: 'GTB Biker Kit',
      subtitle: '4-Piece Motorcycle Safety Kit',
      description: 'Includes 1 High-Impact PVC Helmet Tag, 1 Emergency Key Chain Tag, Small Visor Stickers & Large Bike Frame Stickers for complete rider protection.',
      icon: Bike,
      badge: 'AVAILABLE NOW',
      isComingSoon: false,
      position: { x: -180, z: -40, rotateY: 15 },
    },
    {
      id: 'GTK' as const,
      name: 'GTK Kids Bundle',
      subtitle: 'Complete 10-Piece Safety Kit',
      description: 'Includes 4 small stickers, 1 key tag, 1 badge & 4 iron-on clothing stickers for full school & daily protection.',
      icon: Baby,
      badge: 'COMING SOON',
      isComingSoon: true,
      position: { x: -60, z: 0, rotateY: 5 },
    },
    {
      id: 'GTT' as const,
      name: 'GTT Traveller',
      subtitle: 'Luggage & Bag Return',
      description: 'Heavy-duty luggage loop tag with steel wire connector. Enables airport return without exposing home address.',
      icon: Briefcase,
      badge: 'COMING SOON',
      isComingSoon: true,
      position: { x: 60, z: -20, rotateY: -5 },
    },
    {
      id: 'GTU' as const,
      name: 'GTU Universal',
      subtitle: 'Vehicle & Asset Security',
      description: 'Versatile 3M adhesive decal for cars, two-wheelers, laptops, and keychains with high-vis warning pattern.',
      icon: Car,
      badge: 'COMING SOON',
      isComingSoon: true,
      position: { x: 180, z: -60, rotateY: -15 },
    },
  ];

  const selectedProduct = products.find((p) => p.id === selectedId) || products[0];

  const handleSelect = (id: 'GTB' | 'GTK' | 'GTT' | 'GTU') => {
    soundEngine.playClick();
    setSelectedId(id);
  };

  return (
    <div className="w-full py-20 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            INTERACTIVE 3D PRODUCT SELECTOR
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Select Your Safety Specimen.
          </h2>
          <p className="text-neutral-400 text-base font-normal">
            Click or swipe any tag model below to bring it into 3D camera focus.
          </p>
        </div>

        {/* 3D SPATIAL ORBIT SELECTOR STAGE WITH TOUCH SWIPE SNAP */}
        <div className="relative min-h-[380px] flex items-center justify-center perspective-1000 my-8 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-none">
          <div className="flex items-center justify-center gap-4 sm:gap-8 z-20 px-4 min-w-max">
            {products.map((p) => {
              const isSelected = selectedId === p.id;
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  onMouseEnter={() => soundEngine.playHover()}
                  animate={{
                    scale: isSelected ? 1.15 : 0.88,
                    opacity: isSelected ? 1 : 0.55,
                    y: isSelected ? -15 : 0,
                    z: isSelected ? 50 : p.position.z,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`cursor-pointer hardware-card p-4 rounded-3xl border-2 transition-all snap-center min-w-[200px] sm:min-w-[220px] ${
                    isSelected ? 'border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.25)]' : 'border-white/20 hover:border-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                      {p.id}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                  </div>

                  <PhysicalTag3D size="sm" tagType={p.id} serial={`${p.id}-SELECT`} interactive={isSelected} />

                  <div className="pt-3 text-center space-y-1">
                    <span className={`text-xs font-mono font-extrabold block ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                      {p.name}
                    </span>
                    {p.isComingSoon ? (
                      <span className="inline-block text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        COMING SOON
                      </span>
                    ) : (
                      <span className="inline-block text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        AVAILABLE NOW
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SELECTED SPECIMEN DETAIL BOARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="hardware-card p-8 rounded-3xl border-2 border-white/20 shadow-2xl max-w-3xl mx-auto space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-xs font-mono font-extrabold text-white uppercase">
                  {selectedProduct.name} SPECIFICATION
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                selectedProduct.isComingSoon 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {selectedProduct.badge}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              {selectedProduct.subtitle}
            </h3>

            <p className="text-neutral-300 text-sm font-normal leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {selectedProduct.isComingSoon ? (
                <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                  <span>🚀 Launching Shortly • Join Waitlist in Catalog</span>
                </div>
              ) : (
                <a
                  href="/products"
                  onClick={() => soundEngine.playClick()}
                  className="text-xs font-extrabold text-white hover:text-neutral-300 transition flex items-center gap-2"
                >
                  <span>Order {selectedProduct.name} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
