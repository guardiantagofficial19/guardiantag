'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Truck, RefreshCcw, Smartphone } from 'lucide-react';
import { CONTAINER_CLASS } from '@/components/ui/SectionHeader';

// Concrete buying facts (each one is backed by the FAQ / product page).
const facts = [
  { icon: IndianRupee, title: '₹499, one time', text: 'The full Biker Kit. No subscription.' },
  { icon: Truck, title: 'Free delivery', text: 'Across India in 3–5 days.' },
  { icon: RefreshCcw, title: '7-day replacement', text: 'If a tag is damaged or won’t scan.' },
  { icon: Smartphone, title: 'Works with any phone', text: 'iPhone or Android, no app.' },
];

export default function TrustSection() {
  return (
    <section aria-label="Why GuardianTag" className="relative bg-black text-white border-b border-white/10 py-12 sm:py-14">
      <div className={CONTAINER_CLASS}>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {facts.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <span className="w-10 h-10 shrink-0 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm sm:text-base font-semibold text-white">{f.title}</span>
                  <span className="block text-sm text-neutral-400">{f.text}</span>
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
