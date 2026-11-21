'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff, Eye, CheckCircle2 } from 'lucide-react';

const PRIVATE_DATA = [
  { id: 1, label: 'Your phone number', example: '+91 98765 43210', status: 'Hidden' },
  { id: 2, label: 'Home address', example: 'Flat 402, …', status: 'Hidden' },
  { id: 3, label: 'Aadhaar / government ID', example: 'XXXX XXXX 1234', status: 'Never collected' },
];

/**
 * Interactive privacy demo card: shows which personal details stay hidden and what a bystander
 * can still do. Used inside PrivacySection.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PrivacyDisintegration(_props: { embedded?: boolean }) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="hardware-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 w-full">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Lock className="w-4 h-4 text-yellow-400" />
          What a stranger can see
        </div>
        <button
          type="button"
          onClick={() => setHidden(!hidden)}
          aria-pressed={hidden}
          className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer flex items-center gap-1.5"
        >
          {hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {hidden ? 'Show again' : 'Apply GuardianTag'}
        </button>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs text-neutral-500">Your personal details</p>
        {PRIVATE_DATA.map((node) => (
          <motion.div
            key={node.id}
            animate={{ opacity: hidden ? 0.45 : 1 }}
            transition={{ duration: 0.4, delay: node.id * 0.08 }}
            className={`p-3.5 rounded-xl text-sm flex justify-between items-center gap-3 border transition-colors ${
              hidden ? 'bg-white/[0.02] border-white/5' : 'bg-white/5 border-white/15'
            }`}
          >
            <span className="min-w-0">
              <span className="block text-neutral-200 font-medium">{node.label}</span>
              <span className={`block font-mono text-xs ${hidden ? 'text-neutral-600 blur-[3px] select-none' : 'text-neutral-400'}`}>
                {node.example}
              </span>
            </span>
            <span
              className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${
                hidden ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-white/10 text-neutral-300'
              }`}
            >
              {hidden ? node.status : 'Visible'}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10 space-y-2.5">
        <p className="text-xs text-neutral-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
          What they can still do
        </p>
        <div className="p-4 rounded-2xl bg-white text-black text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <span className="font-semibold">Call your emergency contact</span>
            <span className="text-neutral-600">Number hidden</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-semibold">Call 112 / 1033</span>
            <span className="text-neutral-600">Direct</span>
          </div>
        </div>
      </div>
    </div>
  );
}
