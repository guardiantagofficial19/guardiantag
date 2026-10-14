'use client';

import React from 'react';
import { Check, X, ShieldCheck, BatteryCharging, Zap, Lock, DollarSign } from 'lucide-react';

export default function ComparisonGrid() {
  const comparisonItems = [
    {
      feature: 'Upfront Device Cost',
      guardianTag: '₹299 – ₹499 (One-Time)',
      gpsTracker: '₹3,000 – ₹8,000+',
      icon: DollarSign,
    },
    {
      feature: 'Monthly Subscription Fees',
      guardianTag: '₹0 / Lifetime Free',
      gpsTracker: '₹399 – ₹699 / month',
      icon: Lock,
    },
    {
      feature: 'Battery & Charging Requirement',
      guardianTag: 'Never Requires Charging (0 Battery)',
      gpsTracker: 'Dies in 2–5 days (Requires constant charging)',
      icon: BatteryCharging,
    },
    {
      feature: 'Scanner App Download',
      guardianTag: 'Zero App Needed (Standard Phone Camera)',
      gpsTracker: 'Mandatory custom app & user account',
      icon: Zap,
    },
    {
      feature: 'Caller Phone Privacy',
      guardianTag: '100% Masked Twilio Relay (Number Hidden)',
      gpsTracker: 'Exposes owner phone or requires login',
      icon: ShieldCheck,
    },
    {
      feature: 'Weather & Water Durability',
      guardianTag: '100% Waterproof & Weather Resistant',
      gpsTracker: 'Sensitive electronic circuit board',
      icon: Check,
    },
  ];

  return (
    <section id="comparison" className="py-20 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#064E3B] text-xs font-extrabold uppercase">
            Clear Technology Advantage
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why GuardianTag Beats GPS Trackers
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            Traditional GPS trackers die, require monthly bills, and need app downloads. GuardianTag is zero-maintenance safety designed for real life.
          </p>
        </div>

        {/* Comparison Table / Card Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-900 text-white p-5 sm:p-6 text-sm font-bold items-center">
            <div className="col-span-5 sm:col-span-5 text-slate-300">Feature Comparison</div>
            <div className="col-span-4 sm:col-span-4 text-emerald-400 font-extrabold flex items-center gap-1.5 text-base sm:text-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>GuardianTag</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-slate-400 font-semibold text-xs sm:text-sm">
              Battery GPS Trackers
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisonItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="grid grid-cols-12 p-5 sm:p-6 text-xs sm:text-sm items-center hover:bg-slate-50/80 transition-colors">
                  {/* Feature Label */}
                  <div className="col-span-5 sm:col-span-5 font-bold text-slate-800 flex items-center gap-2 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0 hidden sm:flex">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.feature}</span>
                  </div>

                  {/* GuardianTag Advantage */}
                  <div className="col-span-4 sm:col-span-4 font-extrabold text-[#064E3B] flex items-center gap-2 pr-2">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{item.guardianTag}</span>
                  </div>

                  {/* GPS Tracker Disadvantage */}
                  <div className="col-span-3 sm:col-span-3 font-medium text-slate-500 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{item.gpsTracker}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
