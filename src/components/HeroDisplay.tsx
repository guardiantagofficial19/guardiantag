'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, QrCode, ArrowRight, CheckCircle2, Zap, Heart, Compass, Lock } from 'lucide-react';

interface HeroDisplayProps {
  onSimulateScan?: () => void;
}

export default function HeroDisplay({ onSimulateScan }: HeroDisplayProps) {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-emerald-950/5 via-slate-50 to-white text-slate-900 pt-10 pb-20 border-b border-slate-200/80 overflow-hidden">
      
      {/* Soft background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Column Text Story, Right Column Interactive Tag Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Text Story) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-[#064E3B] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>India&apos;s #1 Physical QR Safety &amp; Emergency Shield</span>
            </div>

            {/* Main Display Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-sans">
              Protect What Matters Most in <span className="text-[#064E3B]">1 Second</span>.
            </h1>

            {/* Sub-headline description */}
            <p className="text-base sm:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Attach to <strong className="text-slate-900 font-bold">helmets, school bags, luggage &amp; vehicles</strong>. If an emergency occurs, anyone can scan the tag to connect with family instantly — <span className="text-[#FF4D4D] font-bold">no app download, login, or battery required</span>.
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#products"
                className="px-8 py-4 rounded-2xl bg-[#064E3B] hover:bg-[#04392a] text-white font-bold text-base shadow-lg shadow-emerald-950/15 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Shop GuardianTags — From ₹299</span>
                <ArrowRight className="w-5 h-5 text-emerald-300" />
              </a>

              <button
                onClick={onSimulateScan}
                className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-xs transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5 text-[#FF4D4D]" />
                <span>Try Live Demo Scan 📱</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Battery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Masked Calls</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Instant SMS</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Weatherproof</span>
              </div>
            </div>

          </div>

          {/* Right Column: Physical Tag Renders & Context Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 space-y-6">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Tag Preview</span>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                  Ready to Scan
                </span>
              </div>

              {/* Tag Showcase Renders */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* GTB Biker */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-500 transition group">
                  <div className="w-16 h-16 mx-auto bg-[#064E3B] rounded-xl p-2 flex flex-col items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-[8px] font-bold text-emerald-300">GTB BIKER</span>
                    <QrCode className="w-8 h-8 text-white my-0.5" />
                    <span className="text-[7px] font-mono">GTB0001</span>
                  </div>
                  <h4 className="mt-2.5 text-xs font-bold text-slate-800">Helmets &amp; Bikes</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Accident Emergency</p>
                </div>

                {/* GTK Kids */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-500 transition group">
                  <div className="w-16 h-16 mx-auto bg-[#FF4D4D] rounded-xl p-2 flex flex-col items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-[8px] font-bold text-white">GTK KIDS</span>
                    <QrCode className="w-8 h-8 text-white my-0.5" />
                    <span className="text-[7px] font-mono">GTK0001</span>
                  </div>
                  <h4 className="mt-2.5 text-xs font-bold text-slate-800">School Bags</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Child Safety Charm</p>
                </div>

                {/* GTT Traveller */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-500 transition group">
                  <div className="w-16 h-16 mx-auto bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-[8px] font-bold text-teal-300">GTT TRAVEL</span>
                    <QrCode className="w-8 h-8 text-white my-0.5" />
                    <span className="text-[7px] font-mono">GTT0001</span>
                  </div>
                  <h4 className="mt-2.5 text-xs font-bold text-slate-800">Suitcases &amp; Bags</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Global Luggage Return</p>
                </div>

                {/* GTU Universal */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-500 transition group">
                  <div className="w-16 h-16 mx-auto bg-emerald-800 rounded-xl p-2 flex flex-col items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-[8px] font-bold text-amber-300">GTU ASSETS</span>
                    <QrCode className="w-8 h-8 text-white my-0.5" />
                    <span className="text-[7px] font-mono">GTU0001</span>
                  </div>
                  <h4 className="mt-2.5 text-xs font-bold text-slate-800">Keys &amp; Vehicles</h4>
                  <p className="text-[10px] text-slate-500 font-medium">3M Adhesive Backing</p>
                </div>

              </div>

              {/* Bottom tag activation line */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Already own a tag?</span>
                <Link
                  href="/register"
                  className="font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                >
                  Activate QR Code →
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

