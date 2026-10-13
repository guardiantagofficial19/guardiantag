'use client';

import React, { useState } from 'react';
import { Bike, Baby, Briefcase, Car, Shield, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { TagType } from '@/lib/types';

export default function TagVariantsShowcase() {
  const [activeType, setActiveType] = useState<TagType>('GTB');

  const variants = [
    {
      type: 'GTB' as TagType,
      name: 'GTB — Bikers Shield',
      icon: Bike,
      tagline: 'Helmet & Motorcycle Accident Emergency Tag',
      price: '₹399',
      badgeColor: 'bg-[#064E3B]',
      features: [
        'Crash-proof polycarbonate outer shell',
        'High-temperature & weather IP68 resistant',
        'Direct road accident emergency alert',
        'Sample ID: GTB0001 (Try live scan demo)',
      ],
      idealFor: 'Full-face helmets, motorbikes, riding jackets, superbikes',
    },
    {
      type: 'GTK' as TagType,
      name: 'GTK — Kids Safety',
      icon: Baby,
      tagline: 'Backpack & School Safety Tag',
      price: '₹349',
      badgeColor: 'bg-[#FF4D4D]',
      features: [
        'Soft non-toxic food-grade silicone casing',
        'Childline 1098 quick action bar included',
        'Anti-scratch protective surface',
        'Sample ID: GTK0001 (Ready for activation)',
      ],
      idealFor: 'School backpacks, water bottles, shoe tags, jackets',
    },
    {
      type: 'GTT' as TagType,
      name: 'GTT — Traveller Tag',
      icon: Briefcase,
      tagline: 'Luggage & Airport Return Tag',
      price: '₹399',
      badgeColor: 'bg-slate-900',
      features: [
        'Steel wire loop attachment included',
        'Global scanning capability at airports',
        'Prevents lost luggage without disclosing address',
        'Sample ID: GTT0001 (Try live scan demo)',
      ],
      idealFor: 'Suitcases, duffel bags, laptop sleeves, camera bags',
    },
    {
      type: 'GTU' as TagType,
      name: 'GTU — Universal Shield',
      icon: Car,
      tagline: 'Vehicle & Asset Security Decal',
      price: '₹299',
      badgeColor: 'bg-emerald-800',
      features: [
        'Reflective UV-proof 3M decal backing',
        'Tappable Police (100) & Ambulance (108) buttons',
        'Multi-surface adhesion for glass & metal',
        'Sample ID: GTU0001 (Ready for activation)',
      ],
      idealFor: 'Car windshields, pet collars, laptops, keychains',
    },
  ];

  const current = variants.find(v => v.type === activeType) || variants[0];
  const IconComponent = current.icon;

  return (
    <section id="variants" className="py-20 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#064E3B] text-xs font-extrabold uppercase">
            Specialized Product Formats
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Four Tailored Safety Scenarios
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            Each GuardianTag format is calibrated for specific physical environments (helmets, bags, luggage, or vehicles).
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {variants.map(v => {
            const TabIcon = v.icon;
            const isActive = v.type === activeType;
            return (
              <button
                key={v.type}
                onClick={() => setActiveType(v.type)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all ${
                  isActive
                    ? 'bg-[#064E3B] text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Variant Showcase Card */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Tag Visual Representation */}
            <div className="lg:col-span-5 flex flex-col items-center bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center relative overflow-hidden">
              <div className={`w-28 h-28 rounded-3xl ${current.badgeColor} p-1 flex items-center justify-center shadow-md mb-6 transition-colors`}>
                <div className="w-full h-full bg-white rounded-2xl p-4 flex flex-col items-center justify-between">
                  <span className="text-[11px] font-bold text-[#064E3B] tracking-wider">GUARDIAN</span>
                  <IconComponent className="w-10 h-10 text-slate-900" />
                  <span className="text-xs font-mono font-bold text-slate-900">{current.type}0001</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064E3B] text-white text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Format: {current.type}XXXX</span>
              </div>

              <span className="text-3xl font-extrabold text-slate-900">{current.price}</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">Lifetime Encrypted Relay Included</span>
            </div>

            {/* Content & Details */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                  {current.name}
                </h3>
                <p className="text-sm font-bold text-[#064E3B] mt-1">{current.tagline}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Safety Specifications:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
                  {current.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 text-xs text-slate-800 font-semibold">
                <strong className="text-[#064E3B] font-bold">Ideal Application:</strong> {current.idealFor}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`/tag/${current.type}0001`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#04392a] text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
                >
                  <span>Test Public Emergency Page ({current.type}0001)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </a>

                <a
                  href="/register"
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition"
                >
                  Activate {current.type} Tag
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
