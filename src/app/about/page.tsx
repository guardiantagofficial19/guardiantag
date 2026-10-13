'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, PhoneCall, Lock, HeartHandshake, Zap, Award, Users, ArrowRight, EyeOff, Radio, CheckCircle2 } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 sm:pt-40 pb-24 bg-black border-b border-white/15 relative overflow-hidden">
        {/* Background Subtle Lighting Grid */}
        <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>OUR MISSION &amp; BUSINESS STORY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Engineering India&apos;s Next-Gen Emergency Safety Hardware.
          </h1>

          <p className="text-neutral-300 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            GuardianTag bridges first responders, Good Samaritan bystanders, and asset owners in critical emergency situations — without ever exposing personal phone numbers or home addresses to the public.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm flex items-center gap-2 shadow-2xl transition transform hover:scale-[1.02]"
            >
              <span>Explore Hardware Catalog</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* KEY BUSINESS NUMBERS & METRICS */}
      <section className="py-12 bg-black border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white block">25,000+</span>
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">Active Tags Across India</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white block">&lt; 3 Sec</span>
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">Emergency Relay Speed</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white block">99.98%</span>
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">System Uptime SLA</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-emerald-400 block">4.9 / 5</span>
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">Safety Rating</span>
          </div>
        </div>
      </section>

      {/* THE PROBLEM & OUR SOLUTION */}
      <section className="py-20 bg-black border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              WHY GUARDIANTAG WAS CREATED
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The Emergency Communication Dilemma
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Dilemma Card */}
            <div className="hardware-card p-8 sm:p-10 rounded-3xl border border-red-500/20 bg-red-950/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Traditional Tags &amp; Smartphone Passcodes
              </h3>
              <ul className="space-y-3 text-xs font-mono text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Locked Passcodes:</strong> In road accidents, smartphones are locked. First responders cannot reach emergency contacts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Public Privacy Leakage:</strong> Traditional luggage or keychain tags display raw phone numbers and home addresses to everyone passing by.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>No Battery / App Dependency:</strong> Electronic Bluetooth trackers run out of battery and require proprietary app installations.</span>
                </li>
              </ul>
            </div>

            {/* GuardianTag Solution Card */}
            <div className="hardware-card p-8 sm:p-10 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-xl font-extrabold text-white">
                The GuardianTag Physical QR Solution
              </h3>
              <ul className="space-y-3 text-xs font-mono text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Zero App Required:</strong> Anyone with any standard smartphone camera can scan the tag instantly in seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Twilio Masked Voice Relay:</strong> Bystanders connect to owners via 2-way masked phone calls without revealing phone numbers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Instant GPS Emergency SMS:</strong> Dispatches timestamped SMS alerts with Google Maps coordinates to emergency contacts.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BUSINESS PILLARS */}
      <section className="py-20 bg-black border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              OUR TECHNOLOGY &amp; HARDWARE PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Harsh Indian Weather &amp; Extreme Conditions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
            
            {/* Pillar 1 */}
            <div className="hardware-card p-8 rounded-3xl border border-white/15 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Zero PII Data Exposure
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Our server architecture isolates owner identities behind Supabase Row-Level Security policies. Bystanders never see your phone number, surname, or home address.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="hardware-card p-8 rounded-3xl border border-white/15 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Polycarbonate &amp; Silicone Hardware
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Engineered with high-impact UV polycarbonate, food-grade non-toxic silicone, and 3M heavy-duty automotive adhesives resistant to 120km/h wind force and heavy rain.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="hardware-card p-8 rounded-3xl border border-white/15 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Twilio Telephony &amp; GPS Dispatch
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Powered by enterprise Twilio Voice Call proxies and server-side SMS dispatchers delivering real-time geolocation alerts to family members instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Protect Yourself, Your Loved Ones &amp; Vehicles Today.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto font-mono">
            Get your authentic GuardianTag physical QR specimen with free shipping across India.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm flex items-center gap-2 shadow-2xl transition transform hover:scale-[1.02]"
            >
              <span>Shop GuardianTag Products</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
