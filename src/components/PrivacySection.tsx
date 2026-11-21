'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff, ShieldCheck, FileCheck } from 'lucide-react';
import PrivacyDisintegration from '@/components/cinematic/PrivacyDisintegration';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

const points = [
  {
    icon: EyeOff,
    title: 'Your number is never shown',
    description: 'It isn’t printed on the tag or displayed on the emergency page. Calls are connected for you.',
  },
  {
    icon: Lock,
    title: 'You choose what’s visible',
    description: 'Only the details you pick, such as blood group or vehicle number, appear to the person scanning.',
  },
  {
    icon: ShieldCheck,
    title: 'No tracking, no app',
    description: 'Scanning opens a normal web page. Nothing is installed and no location is tracked in the background.',
  },
  {
    icon: FileCheck,
    title: 'You stay in control',
    description: 'Change contacts, pause the tag if it’s lost, or reset it if you sell the bike, any time.',
  },
];

export default function PrivacySection() {
  return (
    <section id="privacy" className={SECTION_CLASS}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-white/5 rounded-full blur-[180px] pointer-events-none" />

      <div className={`${CONTAINER_CLASS} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>
        <div className="space-y-10">
          <SectionHeader
            align="left"
            eyebrow="Privacy"
            title="Reachable when it matters."
            muted="Private otherwise."
            intro="A stranger can help you without ever seeing your phone number or where you live."
          />

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            {points.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="space-y-2"
                >
                  <Icon className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-base font-semibold text-white">{p.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{p.description}</p>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Interactive demo: what stays hidden vs. what a bystander can do */}
        <PrivacyDisintegration embedded />
      </div>
    </section>
  );
}
