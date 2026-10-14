'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, PhoneCall, Lock, HeartHandshake, Zap, Award, Users, ArrowRight, EyeOff, Radio, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 sm:pt-40 pb-20 bg-black border-b border-white/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OUR STORY &amp; MISSION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Why We Built GuardianTag
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Every day across Indian roads, two-wheeler riders encounter accidents where every minute matters. Yet when a crash happens, smartphones are locked with passcodes or broken, preventing bystanders and emergency services from reaching next-of-kin.
          </p>

          <p className="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Traditional tags display raw phone numbers for anyone to see. We built GuardianTag as a simple, durable physical safety tag that bridges Good Samaritan first responders to emergency contacts without exposing rider personal numbers.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/#products"
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm flex items-center gap-2 shadow-2xl transition transform hover:scale-[1.02]"
            >
              <span>Get Your Biker Tag — ₹499</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* THREE CORE PRINCIPLES */}
      <section className="py-20 bg-black border-b border-white/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              OUR FOUNDING PRINCIPLES
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Built on Rider Safety &amp; Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* Principle 1 */}
            <div className="hardware-card p-8 rounded-2xl border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                01. Your Number Stays Hidden
              </h3>
              <p className="text-neutral-400 leading-relaxed font-sans">
                A bystander scanning your helmet tag only sees a button to initiate an emergency call relay or dial 112. Your private phone number is never printed on the sticker or exposed to scanners.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="hardware-card p-8 rounded-2xl border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                02. Zero App, Zero Batteries
              </h3>
              <p className="text-neutral-400 leading-relaxed font-sans">
                Electronic trackers run out of charge. GuardianTag uses passive optical QR technology on all-weather weatherproof vinyl and PVC that never requires charging, cables, or special app downloads.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="hardware-card p-8 rounded-2xl border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                03. No Yearly Subscription
              </h3>
              <p className="text-neutral-400 leading-relaxed font-sans">
                Safety hardware shouldn&apos;t be held behind an ongoing subscription. ₹499 is a one-time purchase with free delivery across India, including 7-day replacements if damaged in transit.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT ACTUALLY WORKS AT CRASH SITE */}
      <section className="py-20 bg-black border-b border-white/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase tracking-widest block">
              REAL EMERGENCY PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              What Happens When Someone Scans
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-2xl font-extrabold text-white block">Step 01</span>
              <h4 className="text-sm font-bold text-white font-sans">Camera Scan</h4>
              <p className="text-neutral-400 font-sans leading-relaxed">
                A bystander or traffic personnel opens their phone camera and scans the QR code on the rider&apos;s helmet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-2xl font-extrabold text-white block">Step 02</span>
              <h4 className="text-sm font-bold text-white font-sans">First Aid &amp; Helplines</h4>
              <p className="text-neutral-400 font-sans leading-relaxed">
                The scanner immediately sees crucial first aid instructions (do not remove helmet) along with one-tap buttons to dial 112 (National Emergency) and 108 (Ambulance).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-2xl font-extrabold text-white block">Step 03</span>
              <h4 className="text-sm font-bold text-white font-sans">Emergency Contact Reached</h4>
              <p className="text-neutral-400 font-sans leading-relaxed">
                The scanner taps &quot;Call Emergency Contact&quot; to reach the rider&apos;s registered ICE contact via our secure call bridge without revealing private phone numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & CREDIBILITY */}
      <section className="py-20 bg-black text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Have Questions or Need Support?
          </h2>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto font-sans leading-relaxed">
            We are dedicated to building reliable safety products for the Indian riding community. Reach our team directly:
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/10">
            <span><strong>Email:</strong> support@guardiantag.in</span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span><strong>WhatsApp:</strong> +91 80588 00880</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
