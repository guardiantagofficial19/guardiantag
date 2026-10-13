'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PhoneCall, MessageSquare, ShieldCheck, ArrowDown, Lock, CheckCircle2, QrCode } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import ScanningBeam from '@/components/cinematic/ScanningBeam';

export default function EmergencyDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Camera push into QR -> Phone UI Transition
  const phoneScale = useTransform(smoothProgress, [0.2, 0.6], [0.85, 1]);
  const phoneOpacity = useTransform(smoothProgress, [0.15, 0.4], [0, 1]);

  return (
    <section id="emergency" ref={containerRef} className="py-24 bg-black text-white border-b border-white/15 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* MAJOR CINEMATIC TRANSITION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            CINEMATIC PROTOCOL: SCAN TO EMERGENCY CONNECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            When seconds matter, make contact instant.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal">
            Bystander scans physical tag → Optical QR verifies → Masked emergency mobile interface renders instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: QR Push & Interactive Trigger */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Visual Hardware Scan Trigger */}
            <div className="hardware-card p-6 rounded-3xl space-y-4 border-2 border-white/20 text-center">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                STEP 1: PHYSICAL HARDWARE SCAN
              </span>
              
              <div className="flex justify-center relative my-2">
                <PhysicalTag3D size="md" serial="GTB-EMERGENCY-01" />
                {isScanning && <ScanningBeam className="absolute inset-0 rounded-3xl" />}
              </div>

              <button
                onClick={() => setIsScanning(!isScanning)}
                className="w-full py-3.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider shadow-xl hover:bg-neutral-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-black" />
                <span>{isScanning ? 'Reset QR Scan Trigger' : 'Simulate Optical QR Scan'}</span>
              </button>
            </div>

            {/* Conceptual Protocol Sequence */}
            <div className="pt-2 space-y-3 font-mono text-xs font-bold">
              <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/15 text-white">
                <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center text-xs font-black">1</span>
                <span>OPTICAL SCAN INITIATED (NO APP REQUIRED)</span>
              </div>
              
              <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/15 text-white">
                <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center text-xs font-black">2</span>
                <span>TWILIO VOICE MASKED PROXY CREATED</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/15 text-white">
                <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center text-xs font-black">3</span>
                <span>DIRECT EMERGENCY CONTACT DISPATCHED</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Smartphone Emergency UI Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div style={{ scale: phoneScale, opacity: phoneOpacity }} className="w-full max-w-sm">
              <div className="hardware-card p-6 sm:p-8 rounded-[40px] border-4 border-white/30 shadow-2xl bg-black relative space-y-6">
                
                {/* Phone Notch / Status Header */}
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-b border-white/15 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-white font-extrabold">GT-EMERGENCY VERIFIED</span>
                  </div>
                  <span>100% PRIVATE</span>
                </div>

                {/* Mobile UI Screen Header */}
                <div className="text-center space-y-1 py-2">
                  <span className="text-[10px] font-mono font-bold bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                    EMERGENCY CONTACT PORTAL
                  </span>
                  <h4 className="text-2xl font-extrabold text-white tracking-tight pt-2">
                    GuardianTag #GTB0002
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono">
                    Yamaha R15 • Blood Group: O+ Positive
                  </p>
                </div>

                {/* Single-Tap Emergency Call Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-sm shadow-xl flex items-center justify-center gap-3 cursor-pointer hover:bg-neutral-200 transition">
                    <PhoneCall className="w-5 h-5 text-black" />
                    <span>Call Owner (Masked Proxy)</span>
                  </button>

                  <button className="w-full py-3.5 rounded-2xl bg-white/10 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-white/15 transition">
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Send Emergency Location SMS</span>
                  </button>
                </div>

                {/* Verified Helpline Quick Grid */}
                <div className="pt-2 border-t border-white/15 text-left space-y-2">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">
                    Verified Helplines (India)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white flex justify-between">
                      <span>POLICE</span>
                      <span className="font-bold text-white">100</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white flex justify-between">
                      <span>AMBULANCE</span>
                      <span className="font-bold text-white">108</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Guarantee Footnote */}
                <div className="pt-2 text-center text-[10px] text-neutral-400 font-mono flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-white" />
                  <span>Personal numbers remain 100% hidden.</span>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
