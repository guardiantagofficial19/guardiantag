'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { QrCode, PhoneCall, Zap, Smartphone, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import ScanningBeam from '@/components/cinematic/ScanningBeam';

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Camera pullaway for transition into Features
  const containerScale = useTransform(smoothProgress, [0.8, 1], [1, 0.92]);
  const containerOpacity = useTransform(smoothProgress, [0.85, 1], [1, 0.4]);

  const steps = [
    {
      step: '01',
      title: 'SCAN',
      description: 'Bystander scans the physical GuardianTag QR using any smartphone camera. Zero app download required.',
      icon: QrCode,
    },
    {
      step: '02',
      title: 'CONNECT',
      description: 'System instantly dispatches masked phone relay & emergency helpline options without exposing real numbers.',
      icon: PhoneCall,
    },
    {
      step: '03',
      title: 'RESPOND',
      description: 'Designated emergency contact receives instant masked call relay and emergency SMS alert notification.',
      icon: Zap,
    },
  ];

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div style={{ scale: containerScale, opacity: containerOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            THREE-STEP PROTOCOL
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Protection starts with one scan.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal">
            Zero app installation. Zero registration barriers for bystanders. Direct emergency reach in milliseconds.
          </p>
        </div>

        {/* CONTINUOUS VISUAL STORYLINE (SCAN -> CONNECT -> RESPOND) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Step Selector Controls */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeStep === index;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(index)}
                  className={`hardware-card p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
                    isActive ? 'border-white bg-white/10 shadow-2xl scale-[1.02]' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        isActive ? 'bg-white text-black' : 'bg-white/10 text-white'
                      }`}>
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                          <span>{item.title}</span>
                          <Icon className="w-4 h-4 text-neutral-400" />
                        </h3>
                        <p className="text-xs text-neutral-400 pt-1 font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Dynamic Stage Renderer (SCAN -> CONNECT -> RESPOND) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="hardware-card p-8 sm:p-10 rounded-3xl w-full max-w-xl relative overflow-hidden border-2 border-white/20 shadow-2xl min-h-[420px] flex flex-col justify-between items-center text-center">
              
              {/* STAGE 1: SCAN */}
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center space-y-6 my-auto"
                >
                  <div className="relative p-4 rounded-3xl bg-black border border-white/20">
                    <PhysicalTag3D size="md" serial="GTB-4892-IND" />
                    <ScanningBeam className="absolute inset-0 rounded-3xl" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono font-extrabold text-white tracking-widest uppercase">
                      STEP 01: OPTICAL SCAN IN PROGRESS
                    </span>
                    <p className="text-xs text-neutral-400">
                      Standard iOS/Android camera detects physical QR pattern without app download.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: CONNECT */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col items-center space-y-6 my-auto"
                >
                  <div className="flex items-center justify-center gap-6 w-full py-4">
                    <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                      <PhysicalTag3D size="sm" serial="GTB-4892-IND" interactive={false} />
                    </div>

                    {/* Traveling Connection Line Pulse */}
                    <div className="flex-1 h-1 bg-white/20 rounded-full relative overflow-hidden">
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="w-1/3 h-full bg-white shadow-[0_0_12px_#FFFFFF] rounded-full"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl">
                      <Smartphone className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono font-extrabold text-white tracking-widest uppercase">
                      STEP 02: SERVER MASKED PROXY RELAY
                    </span>
                    <p className="text-xs text-neutral-400">
                      Encrypted bridge routes bystander call without exposing real phone numbers.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: RESPOND */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center space-y-6 my-auto"
                >
                  <div className="p-6 rounded-3xl bg-black border border-white/20 w-full space-y-4 shadow-2xl text-left">
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span className="text-xs font-mono font-bold text-white">EMERGENCY ALERT DISPATCHED</span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-400">0.4s LATENCY</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/10 text-white flex justify-between">
                        <span>OWNER VOICE PROXY</span>
                        <span className="font-extrabold text-white">CONNECTED</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/10 text-white flex justify-between">
                        <span>EMERGENCY SMS</span>
                        <span className="font-extrabold text-white">DISPATCHED</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono font-extrabold text-white tracking-widest uppercase">
                      STEP 03: IMMEDIATE EMERGENCY RESPONSE
                    </span>
                    <p className="text-xs text-neutral-400">
                      Emergency contacts &amp; Indian emergency services receive direct alerts.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Stage Navigation Dots */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10 w-full">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeStep === idx ? 'bg-white w-8' : 'bg-white/30'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
}
