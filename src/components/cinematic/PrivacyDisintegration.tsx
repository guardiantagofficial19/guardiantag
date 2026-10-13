'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, Lock, ShieldCheck, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';

export default function PrivacyDisintegration() {
  const [disintegrated, setDisintegrated] = useState(false);

  const privateDataNodes = [
    { id: 1, label: '+91 98765 43210 (REAL PHONE)', type: 'SENSITIVE' },
    { id: 2, label: 'FLAT 402, SUNSHINE APTS (HOME ADDR)', type: 'SENSITIVE' },
    { id: 3, label: 'IP: 192.168.1.45 (LOCATION LAT/LNG)', type: 'SENSITIVE' },
    { id: 4, label: 'SOCIAL SECURITY / AADHAAR ID', type: 'SENSITIVE' },
  ];

  return (
    <div className="w-full py-20 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            PRIVACY DISINTEGRATION VISUALIZATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Connect when needed. Reveal only what matters.
          </h2>
          <p className="text-neutral-400 text-base font-normal">
            Watch how GuardianTag strips away sensitive personal identity markers before rendering emergency contact options to bystanders.
          </p>
        </div>

        {/* INTERACTIVE DATA DISINTEGRATION STAGE */}
        <div className="hardware-card p-8 rounded-3xl border-2 border-white/20 shadow-2xl max-w-3xl mx-auto space-y-8 relative overflow-hidden text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-white" />
              <span className="text-xs font-mono font-extrabold text-white">
                DATA MINIMIZATION ENGINE
              </span>
            </div>

            <button
              onClick={() => setDisintegrated(!disintegrated)}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-xl hover:bg-neutral-200 transition cursor-pointer flex items-center gap-2"
            >
              {disintegrated ? <Sparkles className="w-4 h-4 text-black" /> : <Trash2 className="w-4 h-4 text-black" />}
              <span>{disintegrated ? 'Restore Raw Data Stream' : 'Disintegrate Sensitive PII Data'}</span>
            </button>
          </div>

          {/* Data Nodes Container */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
              RAW SCANNER DATA FEED:
            </span>

            <AnimatePresence>
              {privateDataNodes.map((node) => (
                <motion.div
                  key={node.id}
                  animate={{
                    opacity: disintegrated ? 0.2 : 1,
                    x: disintegrated ? [0, -10, 20, -50] : 0,
                    scale: disintegrated ? 0.9 : 1,
                    filter: disintegrated ? 'blur(4px)' : 'none',
                  }}
                  transition={{ duration: 0.6, delay: node.id * 0.1 }}
                  className={`p-3.5 rounded-xl font-mono text-xs flex justify-between items-center transition-all ${
                    disintegrated ? 'bg-red-950/20 text-neutral-600 line-through border border-red-900/30' : 'bg-white/5 text-white border border-white/15'
                  }`}
                >
                  <span className="font-bold">{node.label}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    {disintegrated ? 'DISINTEGRATED' : node.type}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Filtered Safe Public Output */}
          <div className="pt-4 border-t border-white/15 space-y-3">
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>GUARDIANTAG MASKED EMERGENCY RELAY OUTPUT:</span>
            </span>

            <div className="p-4 rounded-2xl bg-white text-black font-mono text-xs font-bold space-y-2 shadow-xl">
              <div className="flex justify-between">
                <span>ENCRYPTED MASKED PROXY</span>
                <span>PROTECTED</span>
              </div>
              <div className="flex justify-between text-neutral-700 font-normal">
                <span>EMERGENCY HELPLINES (100, 108)</span>
                <span>AVAILABLE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
