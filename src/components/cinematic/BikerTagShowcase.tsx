'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, 
  Key, 
  Sparkles, 
  Maximize2, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Droplets, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  RotateCw
} from 'lucide-react';

interface BikerTagItem {
  id: string;
  badge: string;
  title: string;
  shortName: string;
  tagline: string;
  image: string;
  specs: {
    dimensions: string;
    material: string;
    durability: string;
    mount: string;
  };
  features: {
    icon: any;
    title: string;
    desc: string;
  }[];
  accentColor: string;
  glowColor: string;
}

const TAGS_DATA: BikerTagItem[] = [
  {
    id: 'helmet-tag',
    badge: 'FORMAT 01 • HELMET SPECIALIST',
    title: 'High-Impact PVC Helmet Tag',
    shortName: 'Helmet Tag',
    tagline: 'Engineered for durability & immediate first-responder access right on your helmet.',
    image: '/biker-tags/pvc-helmet-tag.png',
    specs: {
      dimensions: '85mm × 54mm (Credit Card Size)',
      material: 'Flexible High-Density PVC',
      durability: '100% Waterproof & Weather Resistant',
      mount: '3M Automotive-Grade Adhesive Base'
    },
    features: [
      {
        icon: Droplets,
        title: 'Weatherproof Seal',
        desc: 'Built to withstand torrential rain, high-pressure washing, UV rays, and road grime.'
      },
      {
        icon: Zap,
        title: '3-Step Emergency Guide',
        desc: 'Clear guide printed directly on face: 1. Scan QR, 2. Tap Connect, 3. Call Emergency Contact.'
      },
      {
        icon: Sun,
        title: 'High-Visibility Safety Border',
        desc: 'High-contrast hazard yellow framing ensures instant visibility for responders.'
      }
    ],
    accentColor: 'from-amber-400 to-yellow-500',
    glowColor: 'rgba(250, 204, 21, 0.25)'
  },
  {
    id: 'keychain-tag',
    badge: 'FORMAT 02 • KEYRING SENTINEL',
    title: 'Emergency Key Chain Tag',
    shortName: 'Key Chain Tag',
    tagline: 'High-visibility keyring sentinel providing rapid contact access even if helmet is separated.',
    image: '/biker-tags/keychain-tag.png',
    specs: {
      dimensions: '50mm Diameter Circular Shield',
      material: 'Durable Impact PVC + Reinforced Weave',
      durability: 'Scratch-Proof & Impact Resistant',
      mount: 'Heavy-Duty Stainless Steel Keyring'
    },
    features: [
      {
        icon: Key,
        title: 'Ignition-Key Access',
        desc: 'First responders routinely inspect motorcycle keys at the scene of an accident.'
      },
      {
        icon: Shield,
        title: 'Dual-Sided High Contrast QR',
        desc: 'Precision matrix readable from either side regardless of key position.'
      },
      {
        icon: Sparkles,
        title: 'Matte Finish Aesthetic',
        desc: 'Tactical dark texture designed to match high-end motorcycle hardware.'
      }
    ],
    accentColor: 'from-emerald-400 to-green-500',
    glowColor: 'rgba(52, 211, 153, 0.25)'
  },
  {
    id: 'small-sticker',
    badge: 'FORMAT 03 • VISOR & COLLAR DECAL',
    title: 'Visor & Compact Helmet Sticker',
    shortName: 'Visor Sticker',
    tagline: 'Ultra-slim precision decal engineered for visors, suit collars, and subtle placements.',
    image: '/biker-tags/small-sticker.png',
    specs: {
      dimensions: '35mm × 35mm Square (Rounded Edge)',
      material: 'Laminated Flexible Vinyl Film',
      durability: 'UV-Protected & Scratch Resistant',
      mount: 'Contour-Conforming Acrylic Adhesive'
    },
    features: [
      {
        icon: Maximize2,
        title: 'Micro Form Factor',
        desc: 'Compact footprint fits seamlessly on visor lower corner or rear helmet base without obstruction.'
      },
      {
        icon: Layers,
        title: 'Curved Surface Flexibility',
        desc: 'Specialized vinyl backing wraps cleanly around helmet curves without bubbling or lifting.'
      },
      {
        icon: Zap,
        title: 'High-Contrast Optical Matrix',
        desc: 'Calibrated QR pattern allows fast, effortless phone camera reads in seconds.'
      }
    ],
    accentColor: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(56, 189, 248, 0.25)'
  },
  {
    id: 'large-sticker',
    badge: 'FORMAT 04 • BODYWORK & LUGGAGE',
    title: 'Bike Frame & Large Decal',
    shortName: 'Frame Decal',
    tagline: 'Wide-format decal optimized for motorcycle bodywork, fuel tanks, top boxes & side panniers.',
    image: '/biker-tags/large-sticker.png',
    specs: {
      dimensions: '110mm × 70mm Large Card Format',
      material: 'Industrial Heavy-Duty Vinyl Sheet',
      durability: 'Fuel & Weather Resistant Coating',
      mount: 'Permanent All-Weather Bond'
    },
    features: [
      {
        icon: Shield,
        title: 'Wide-Distance Rapid Scan',
        desc: 'Magnified QR code footprint readable by emergency responders from distance.'
      },
      {
        icon: Droplets,
        title: 'Chemical & Rain Guard',
        desc: 'Specialized clear coat protects against fuel spills, chain lube, and road debris.'
      },
      {
        icon: CheckCircle2,
        title: 'Chamfered Anti-Peel Edges',
        desc: 'Precision laser die-cut corners prevent air friction peeling at highway speeds.'
      }
    ],
    accentColor: 'from-orange-400 to-red-500',
    glowColor: 'rgba(251, 146, 60, 0.25)'
  }
];

export default function BikerTagShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Automatic orbit loop by default (rotates every 3.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TAGS_DATA.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const activeTag = TAGS_DATA[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TAGS_DATA.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TAGS_DATA.length) % TAGS_DATA.length);
  };

  return (
    <section id="products" className="relative w-full bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-24">
      {/* Dynamic Background Ambient Light Mesh */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ background: activeTag.glowColor }}
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Interactive Orbital Hardware Showcase
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              4 Physical Formats. <span className="text-yellow-400 font-normal">One Life-Saving System.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Explore our complete lineup of weather-sealed, zero-battery emergency ID tags designed for helmets, keychains, visors, and motorcycle bodywork.
            </p>
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-lg">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition cursor-pointer"
                aria-label="Previous Tag"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs font-bold text-yellow-400 px-3 tracking-wider">
                0{activeIdx + 1} / 0{TAGS_DATA.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition cursor-pointer"
                aria-label="Next Tag"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Orbit Showcase Stage: 3D Orbital Display (Left) + Detail Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive 3D Orbital Ring */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px]">
            
            {/* Orbital Dashed Ring Graphic */}
            <div className="absolute inset-0 m-auto w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite] pointer-events-none" />
            <div className="absolute inset-0 m-auto w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full border border-white/10 pointer-events-none" />

            {/* Central GT Shield Focal Badge */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-neutral-900 to-black border-2 border-yellow-400/70 shadow-[0_0_35px_rgba(250,204,21,0.35)] flex flex-col items-center justify-center backdrop-blur-md group"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <Image
                  src="/gt-shield-logo.png"
                  alt="GuardianTag GT Shield"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain filter invert brightness-200 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                />
              </div>
              <span className="text-[10px] font-mono font-extrabold text-yellow-400 tracking-widest uppercase mt-1">
                GUARDIANTAG
              </span>
            </motion.div>

            {/* 4 Orbiting Tag Nodes */}
            {TAGS_DATA.map((tag, idx) => {
              // Calculate angular offsets relative to active index
              const offset = (idx - activeIdx + TAGS_DATA.length) % TAGS_DATA.length;
              const isSelected = offset === 0;

              // Positioning on orbit: 0 = top/center, 1 = right, 2 = bottom, 3 = left
              const angles = [0, 90, 180, 270];
              const angleDeg = angles[offset];
              const angleRad = (angleDeg - 90) * (Math.PI / 180);
              
              // Radius in pixels for orbit layout
              const radius = 145; // sm: 175
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={tag.id}
                  animate={{ 
                    x, 
                    y,
                    scale: isSelected ? 1.15 : 0.82,
                    opacity: isSelected ? 1 : 0.55,
                    zIndex: isSelected ? 30 : 10
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  onClick={() => setActiveIdx(idx)}
                  className={`absolute cursor-pointer transition-shadow rounded-xl p-2 bg-neutral-900/90 border backdrop-blur-md ${
                    isSelected 
                      ? `border-yellow-400 shadow-2xl shadow-yellow-500/30 ring-2 ring-yellow-400/40` 
                      : 'border-white/15 hover:border-white/40 hover:opacity-90'
                  }`}
                >
                  <div className="relative w-24 h-20 sm:w-32 sm:h-24 flex items-center justify-center p-1 overflow-hidden">
                    <Image
                      src={tag.image}
                      alt={tag.title}
                      width={120}
                      height={90}
                      className="object-contain max-h-full w-auto drop-shadow-md"
                    />
                  </div>
                  <div className="text-center pt-1 border-t border-white/10">
                    <span className={`text-[10px] font-mono font-bold block truncate max-w-[100px] sm:max-w-[120px] ${
                      isSelected ? 'text-yellow-400' : 'text-neutral-400'
                    }`}>
                      {tag.shortName}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Detailed Animated Spotlight Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTag.id}
                initial={{ opacity: 0, x: 20, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.96 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="rounded-3xl bg-neutral-900/80 border border-white/15 p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-2xl shadow-black/80"
              >
                {/* Header Badge & Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15 font-mono text-xs font-bold text-yellow-400 tracking-wider uppercase">
                      {activeTag.badge}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 uppercase">
                      FORMAT 0{activeIdx + 1} OF 04
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeTag.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {activeTag.tagline}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-3 pt-1">
                  {activeTag.features.map((feat, fIdx) => {
                    const Icon = feat.icon;
                    return (
                      <div 
                        key={fIdx} 
                        className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-yellow-400 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wide">
                            {feat.title}
                          </h4>
                          <p className="text-xs text-neutral-400 leading-snug">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-neutral-500 block text-[10px] uppercase">Dimensions</span>
                    <span className="text-neutral-200 font-semibold leading-tight block">{activeTag.specs.dimensions}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-neutral-500 block text-[10px] uppercase">Mounting System</span>
                    <span className="text-neutral-200 font-semibold leading-tight block">{activeTag.specs.mount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-neutral-500 block text-[10px] uppercase">Material Core</span>
                    <span className="text-neutral-200 font-semibold leading-tight block">{activeTag.specs.material}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-neutral-500 block text-[10px] uppercase">Weather Rating</span>
                    <span className="text-yellow-400 font-semibold leading-tight block">{activeTag.specs.durability}</span>
                  </div>
                </div>

                {/* Action CTA & Quick Switch Strip */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto flex-1 px-6 py-3 rounded-xl bg-yellow-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 transition text-center"
                  >
                    Get 4-Piece Biker Kit — ₹499
                  </Link>

                  {/* Format Selector Dots */}
                  <div className="flex items-center gap-2">
                    {TAGS_DATA.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setActiveIdx(dotIdx)}
                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                          activeIdx === dotIdx 
                            ? 'bg-yellow-400 scale-125 ring-2 ring-yellow-400/40' 
                            : 'bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Select Tag ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
