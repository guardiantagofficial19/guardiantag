'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Bike, Baby, Briefcase, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function UseCases() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'GTB' | 'GTK' | 'GTT' | 'GTU'>('GTB');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Camera follow transform
  const tagRotate = useTransform(smoothProgress, [0.2, 0.8], ['-8deg', '8deg']);
  const tagScale = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0.95, 1.05, 0.95]);

  const chapters = [
    {
      id: 'GTB' as const,
      category: 'CHAPTER 01',
      title: 'Motorcycle & Rider Safety (GTB)',
      environment: 'Helmet & Open Highway Biker Environment',
      description: 'Accidents happen on the open road in milliseconds. Mounting GTB on full-face helmets or riding jackets ensures bystanders can alert your family immediately without fumbling through your phone.',
      icon: Bike,
      specs: ['Impact-Resistant PVC & Vinyl', 'High-Visibility Safety Frame', 'Curved Helmet Surface Bond'],
    },
    {
      id: 'GTK' as const,
      category: 'CHAPTER 02',
      title: 'Child & Backpack Protection (GTK)',
      environment: 'School & Family Daily Environment',
      description: 'School backpacks, water bottles, and jackets can get misplaced or lost in crowded places. GTK provides a soft, non-toxic silicone tag so anyone who finds your child can reach you instantly.',
      icon: Baby,
      specs: ['Food-Grade Non-Toxic Silicone', '100% Waterproof Seal', 'Direct Parent Call Relay'],
    },
    {
      id: 'GTT' as const,
      category: 'CHAPTER 03',
      title: 'Travel & Luggage Recovery (GTT)',
      environment: 'Airport Transit & Luggage Environment',
      description: 'Airport luggage terminals and railway transit can separate you from your bags. GTT attaches via reinforced steel cable loops, allowing baggage finders to contact you globally without revealing home addresses.',
      icon: Briefcase,
      specs: ['Steel Wire Loop Lock', 'Global Web Scanner Access', 'Zero Address Exposure'],
    },
    {
      id: 'GTU' as const,
      category: 'CHAPTER 04',
      title: 'Universal Vehicle & Asset Decal (GTU)',
      environment: 'Everyday Vehicle & Gear Environment',
      description: 'Car windshields, laptop sleeves, pet collars, and keychains. GTU’s reflective 3M adhesive decal brings instant emergency contact capability to any personal item you value.',
      icon: Car,
      specs: ['Heavy-Duty 3M Adhesive', 'All-Weather Tested', 'Multi-Surface Decal'],
    },
  ];

  const currentChapter = chapters.find((c) => c.id === activeTab) || chapters[0];

  return (
    <section id="use-cases" ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            CINEMATIC USE CASE CHAPTERS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Designed for the Contexts that Matter.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal">
            Seamlessly transitioning between riding, parenting, travelling, and commuting environments.
          </p>
        </div>

        {/* Chapter Navigation Bar (GTB -> GTK -> GTT -> GTU) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {chapters.map((chap) => {
            const Icon = chap.icon;
            const isActive = activeTab === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => setActiveTab(chap.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-xl scale-105 font-extrabold'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15 border border-white/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span>{chap.id}</span>
              </button>
            );
          })}
        </div>

        {/* CHAPTER STORY STAGE: Sticky Camera & Hardware Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Sticky 3D Hardware Specimen Camera Follow */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div style={{ rotateZ: tagRotate, scale: tagScale }} className="relative">
              <PhysicalTag3D size="xl" tagType={activeTab} serial={`${activeTab}-CHAPTER-SPECIMEN`} />
            </motion.div>
          </div>

          {/* Right Column: Environmental Storytelling Card */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hardware-card p-8 sm:p-10 rounded-3xl space-y-6 border-2 border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="text-xs font-mono font-extrabold text-white tracking-widest uppercase">
                  {currentChapter.category}
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                  {currentChapter.environment}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentChapter.title}
              </h3>

              <p className="text-neutral-300 text-sm font-normal leading-relaxed">
                {currentChapter.description}
              </p>

              {/* Hardware Spec Bullet Points */}
              <div className="pt-2 space-y-2 font-mono text-xs">
                {currentChapter.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href="#products"
                  className="text-xs font-extrabold text-white hover:text-neutral-300 transition flex items-center gap-2"
                >
                  <span>Select {activeTab} Model</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
