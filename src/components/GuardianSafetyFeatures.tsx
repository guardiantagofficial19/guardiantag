'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, ShieldCheck, MapPin, LifeBuoy, HeartPulse, ZapOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

interface SafetyFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SAFETY_FEATURES: SafetyFeature[] = [
  {
    icon: PhoneCall,
    title: 'One-tap emergency call',
    description: 'Anyone who scans the tag can call your emergency contact with a single tap. No app, no sign-up.',
  },
  {
    icon: ShieldCheck,
    title: 'Your number stays private',
    description: 'Calls are connected through GuardianTag, so your phone number is never printed on the tag or shown on screen.',
  },
  {
    icon: LifeBuoy,
    title: 'First-aid guidance',
    description: 'Clear on-screen steps for bystanders: keep the helmet on, call 112 or the 1033 highway helpline, then contact family.',
  },
  {
    icon: HeartPulse,
    title: 'Medical notes for responders',
    description: 'Add your blood group and critical notes, such as allergies or conditions, so first responders see them right away.',
  },
  {
    icon: MapPin,
    title: 'Location sharing',
    description: 'A bystander can send the crash location to your emergency contact from the same page, in one tap.',
  },
  {
    icon: ZapOff,
    title: 'No battery, no maintenance',
    description: 'Nothing to charge or pair. Weatherproof vinyl and PVC built for Indian monsoons, dust and daily riding.',
  },
];

export default function GuardianSafetyFeatures() {
  return (
    <section id="features" className={SECTION_CLASS}>
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-yellow-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className={`${CONTAINER_CLASS} space-y-14`}>
        <SectionHeader
          eyebrow="Features"
          title="Built for the golden hour."
          muted="When minutes count."
          intro="Everything a stranger needs to help you, on one page, with your personal details kept private."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAFETY_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="group hardware-card rounded-2xl p-6 sm:p-7 transition-colors duration-300 hover:border-yellow-400/40"
              >
                <div className="w-11 h-11 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-yellow-400 group-hover:text-black">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
