'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Key, Zap, Layers, Droplets, ChevronLeft, ChevronRight, CreditCard, BadgeCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

interface BikerTagItem {
  id: string;
  badge: string;
  title: string;
  shortName: string;
  tagline: string;
  /** Product photo; items without one show `icon` instead. */
  image?: string;
  icon: LucideIcon;
  specs: {
    inKit: string;
    useOn: string;
  };
  features: {
    icon: LucideIcon;
    title: string;
    desc: string;
  }[];
}

// Contents of the GTB Biker Kit: 4 stickers, 2 key rings, 1 PVC card, 1 pin badge.
const TAGS_DATA: BikerTagItem[] = [
  {
    id: 'stickers',
    badge: 'For your helmet and bike',
    title: 'QR stickers',
    shortName: 'Stickers',
    tagline: 'Peel-and-stick QR stickers, including small ones sized for your helmet and your bike.',
    image: '/biker-tags/large-sticker.png',
    icon: Layers,
    specs: {
      inKit: '4 stickers',
      useOn: 'Helmet, bike, visor, bag',
    },
    features: [
      {
        icon: Layers,
        title: 'Peel and stick',
        desc: 'Stick them on any clean, dry surface. No tools needed.',
      },
      {
        icon: Droplets,
        title: 'Waterproof',
        desc: 'Laminated to handle rain, sun and washing.',
      },
      {
        icon: Zap,
        title: 'Fast to scan',
        desc: 'High-contrast QR that any phone camera reads in a second.',
      },
    ],
  },
  {
    id: 'key-rings',
    badge: 'For your keys',
    title: 'QR key rings',
    shortName: 'Key rings',
    tagline: 'Two key rings, so your bike keys and house keys both carry your emergency QR.',
    image: '/biker-tags/keychain-tag.png',
    icon: Key,
    specs: {
      inKit: '2 key rings',
      useOn: 'Bike keys, house keys',
    },
    features: [
      {
        icon: Key,
        title: 'Where responders look',
        desc: 'Keys are one of the first things checked at an accident scene.',
      },
      {
        icon: Shield,
        title: 'A backup to the helmet',
        desc: 'Still with you if the helmet comes off.',
      },
    ],
  },
  {
    id: 'pvc-card',
    badge: 'For your wallet',
    title: 'PVC emergency card',
    shortName: 'PVC card',
    tagline: 'A durable card with your QR that lives in your wallet or phone cover.',
    image: '/biker-tags/pvc-helmet-tag.png',
    icon: CreditCard,
    specs: {
      inKit: '1 card',
      useOn: 'Wallet, phone cover, riding jacket',
    },
    features: [
      {
        icon: CreditCard,
        title: 'Wallet-friendly',
        desc: 'Slips in next to your licence and ID.',
      },
      {
        icon: Droplets,
        title: 'Durable PVC',
        desc: "Won't tear or go soggy like paper.",
      },
    ],
  },
  {
    id: 'pin-badge',
    badge: 'For your jacket',
    title: 'Pin badge',
    shortName: 'Pin badge',
    tagline: 'A pin badge for your riding jacket or bag.',
    icon: BadgeCheck,
    specs: {
      inKit: '1 badge',
      useOn: 'Riding jacket, bag',
    },
    features: [
      {
        icon: BadgeCheck,
        title: 'Pins on anywhere',
        desc: 'Fix it to your jacket, bag strap or backpack.',
      },
    ],
  },
];

export default function BikerTagShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  // Auto-rotates until the visitor interacts; pauses while hovered so a card isn't swapped mid-read.
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!autoPlay || hovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TAGS_DATA.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, hovered]);

  const activeTag = TAGS_DATA[activeIdx];

  const select = (idx: number) => {
    setAutoPlay(false);
    setActiveIdx((idx + TAGS_DATA.length) % TAGS_DATA.length);
  };
  const handleNext = () => select(activeIdx + 1);
  const handlePrev = () => select(activeIdx - 1);

  return (
    <section
      id="products"
      className={SECTION_CLASS}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none bg-yellow-400/10" />

      <div className={`${CONTAINER_CLASS} space-y-12`}>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <SectionHeader
            align="left"
            eyebrow="The Biker Kit"
            title="Everything in the Biker Kit."
            muted="One emergency profile."
            intro="Four stickers, two key rings, a PVC card and a pin badge for ₹499, so your emergency QR goes wherever you do."
          />

          {/* Navigation Controls Bar */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-lg">
              <button
                onClick={handlePrev}
                className="p-3 rounded-lg hover:bg-white/10 text-white transition cursor-pointer"
                aria-label="Previous Tag"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs font-bold text-neutral-300 px-3 tabular-nums">
                {activeIdx + 1} / {TAGS_DATA.length}
              </span>
              <button
                onClick={handleNext}
                className="p-3 rounded-lg hover:bg-white/10 text-white transition cursor-pointer"
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
              <span className="text-[11px] font-mono font-extrabold text-yellow-400 tracking-widest uppercase mt-1">
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
                  onClick={() => select(idx)}
                  className={`absolute cursor-pointer transition-shadow rounded-xl p-2 bg-neutral-900/90 border backdrop-blur-md ${
                    isSelected 
                      ? `border-yellow-400 shadow-2xl shadow-yellow-500/30 ring-2 ring-yellow-400/40` 
                      : 'border-white/15 hover:border-white/40 hover:opacity-90'
                  }`}
                >
                  <div className="relative w-24 h-20 sm:w-32 sm:h-24 flex items-center justify-center p-1 overflow-hidden">
                    {tag.image ? (
                      <Image
                        src={tag.image}
                        alt={tag.title}
                        width={120}
                        height={90}
                        className="object-contain max-h-full w-auto drop-shadow-md"
                      />
                    ) : (
                      <tag.icon className="w-10 h-10 text-yellow-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="text-center pt-1 border-t border-white/10">
                    <span className={`text-[11px] font-mono font-bold block truncate max-w-[100px] sm:max-w-[120px] ${
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
                className="hardware-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80"
              >
                {/* Header Badge & Title */}
                <div className="space-y-2">
                  <span className="inline-block text-xs font-semibold text-yellow-400">
                    {activeTag.badge}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {activeTag.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
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
                          <h4 className="text-sm font-semibold text-white">
                            {feat.title}
                          </h4>
                          <p className="text-[13px] text-neutral-400 leading-snug">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Specifications Grid */}
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-white/10 text-sm">
                  <div className="space-y-0.5">
                    <dt className="text-xs text-neutral-500">In the kit</dt>
                    <dd className="text-neutral-200 font-medium leading-snug">{activeTag.specs.inKit}</dd>
                  </div>
                  <div className="space-y-0.5">
                    <dt className="text-xs text-neutral-500">Use it on</dt>
                    <dd className="text-neutral-200 font-medium leading-snug">{activeTag.specs.useOn}</dd>
                  </div>
                </dl>

                {/* Action CTA & Quick Switch Strip */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-full bg-yellow-400 text-black font-bold text-sm shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 transition text-center"
                  >
                    Get the Biker Kit — ₹499
                  </Link>

                  {/* Format Selector Dots */}
                  <div className="flex items-center gap-6 px-2">
                    {TAGS_DATA.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => select(dotIdx)}
                        className={`relative w-3 h-3 rounded-full transition-all cursor-pointer before:absolute before:-inset-x-2.5 before:-inset-y-4 before:content-[''] ${
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
