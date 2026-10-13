'use client';

import React from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, HeartHandshake, Smile, AlertTriangle } from 'lucide-react';
import { INDIA_HELPLINES } from '@/lib/mockData';

export default function HelplinesBar() {
  const getIcon = (name: string) => {
    if (name.includes('Police')) return ShieldAlert;
    if (name.includes('Ambulance')) return HeartPulse;
    if (name.includes('Women')) return HeartHandshake;
    if (name.includes('Child')) return Smile;
    return AlertTriangle;
  };

  return (
    <section className="py-16 bg-white text-black border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black text-[#FF5500] uppercase tracking-widest">
            🇮🇳 Emergency Infrastructure Integration
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black mt-1">
            Direct 1-Tap Indian Helplines
          </h2>
          <p className="text-neutral-800 text-xs sm:text-sm mt-2 font-bold">
            Every GuardianTag emergency page features hardcoded 1-tap direct dial buttons for primary Indian national helplines.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INDIA_HELPLINES.map((h, idx) => {
            const Icon = getIcon(h.name);
            const num = h.number.split('/')[0].trim();
            return (
              <a
                key={idx}
                href={`tel:${num}`}
                className="bg-neutral-50 p-4 rounded-2xl border border-neutral-300 hover:border-black transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <PhoneCall className="w-4 h-4 text-neutral-400 group-hover:text-[#FF5500] transition-colors" />
                  </div>
                  <h3 className="text-sm font-black text-black group-hover:text-[#FF5500] transition-colors">
                    {h.name}
                  </h3>
                  <p className="text-[10px] text-neutral-600 mt-1 font-medium line-clamp-1">{h.description}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-neutral-200 text-right">
                  <span className="text-lg font-black text-[#FF5500] font-mono tracking-wider">
                    {h.number}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
