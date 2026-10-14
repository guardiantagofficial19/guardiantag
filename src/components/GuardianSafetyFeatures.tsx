'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  PhoneCall, 
  Activity, 
  ShieldCheck, 
  Droplets, 
  MapPin, 
  Sparkles, 
  LifeBuoy, 
  HeartPulse,
  Lock,
  ZapOff,
  Crosshair
} from 'lucide-react';

interface SafetyFeature {
  icon: any;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  accent: string;
  glow: string;
}

const SAFETY_FEATURES: SafetyFeature[] = [
  {
    icon: LifeBuoy,
    title: 'Bystander Emergency Protocol',
    badge: 'CRASH-SITE GUIDANCE',
    subtitle: 'Step-by-Step First Aid Protocol',
    description: 'Guides non-medical bystanders with critical instructions: keep helmet secured to prevent spinal injury, notify emergency services (112 / 1033), and initiate ICE call.',
    accent: 'from-amber-400 to-yellow-500',
    glow: 'rgba(250, 204, 21, 0.15)'
  },
  {
    icon: PhoneCall,
    title: 'One-Tap Emergency Calling',
    badge: 'DIRECT ICE CONNECT',
    subtitle: 'Instant Bystander Reach',
    description: 'Any bystander can tap a single button on their smartphone to call your primary emergency contact immediately, with no app download required.',
    accent: 'from-emerald-400 to-green-500',
    glow: 'rgba(52, 211, 153, 0.15)'
  },
  {
    icon: ShieldCheck,
    title: 'Zero PII Exposure',
    badge: 'PRIVACY FIRST',
    subtitle: 'Your Number Stays Hidden',
    description: 'Your real phone number and personal identity remain private. Calls and connections are routed so your number is never publicly shown on the tag.',
    accent: 'from-cyan-400 to-blue-500',
    glow: 'rgba(56, 189, 248, 0.15)'
  },
  {
    icon: ZapOff,
    title: '100% Battery-Free & Waterproof',
    badge: 'ZERO MAINTENANCE',
    subtitle: 'Zero Charging, All-Weather Build',
    description: 'No charging cables, bluetooth pairing, or batteries. Weatherproof vinyl & PVC construction built to withstand Indian rains, dirt, and daily riding.',
    accent: 'from-orange-400 to-amber-500',
    glow: 'rgba(251, 146, 60, 0.15)'
  },
  {
    icon: HeartPulse,
    title: 'Emergency Medical Notes',
    badge: 'COMING SOON',
    subtitle: 'Blood Group & Critical Notes',
    description: 'Under active development: optional medical notes and blood group information displayable securely during an accident for first responders.',
    accent: 'from-red-400 to-rose-500',
    glow: 'rgba(244, 63, 94, 0.15)'
  },
  {
    icon: MapPin,
    title: 'Crash Location Sharing',
    badge: 'COMING SOON',
    subtitle: 'GPS Location Sharing',
    description: 'In testing: one-tap feature allowing the scanning bystander to send their current GPS coordinates directly to your emergency contact.',
    accent: 'from-purple-400 to-indigo-500',
    glow: 'rgba(192, 132, 252, 0.15)'
  }
];

export default function GuardianSafetyFeatures() {
  return (
    <section className="relative w-full bg-black text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-yellow-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            RIDER SAFETY & EMERGENCY ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for the Golden Hour. <br />
            <span className="text-yellow-400">Engineered for Impact.</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed">
            Every feature of GuardianTag is engineered to save precious minutes during critical motorcycle accidents while keeping your personal identity completely protected.
          </p>
        </div>

        {/* 6 Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFETY_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-3xl bg-neutral-900/70 border border-white/15 p-6 sm:p-8 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Accent Corner Glow */}
                <div 
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none opacity-40"
                  style={{ background: feat.glow }}
                />

                <div className="space-y-4 relative z-10">
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-3 rounded-2xl bg-white/10 text-yellow-400 border border-white/15 group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-yellow-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      {feat.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Spec Footer */}
                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    GUARDIANTAG SAFETY SYSTEM
                  </span>
                  <span className="text-neutral-500">FEATURE 0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
