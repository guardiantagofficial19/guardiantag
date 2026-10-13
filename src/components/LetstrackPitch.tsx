'use client';

import React from 'react';
import { PhoneOff, ShieldAlert, BatteryCharging, HeartPulse, QrCode, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LetstrackPitch() {
  const features = [
    {
      icon: PhoneOff,
      title: 'Masked Calling (Twilio Relay)',
      description: 'Scanners tap to call, but your personal mobile number is NEVER exposed publicly on the web. Encrypted relay bridges the call anonymously.',
      badge: '100% PRIVACY MASKED',
    },
    {
      icon: ShieldAlert,
      title: 'Instant SMS Emergency Alert',
      description: 'The instant a tag is scanned, an emergency SMS alert with GPS timestamp link is dispatched to your emergency contact.',
      badge: 'GPS LOCATION LINKED',
    },
    {
      icon: BatteryCharging,
      title: 'Zero Battery, Zero Maintenance',
      description: 'Passive high-definition optical QR tags work forever without charging, bluetooth pairing, or app updates.',
      badge: 'LIFETIME DURABILITY',
    },
    {
      icon: HeartPulse,
      title: '1-Tap Indian Helplines',
      description: 'Direct emergency buttons on screen for Police (100), Ambulance (108/102), Women Helpline (1091), & Childline (1098).',
      badge: 'NATIONAL HELPLINES',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-extrabold uppercase tracking-wider">
            Zero App • Zero Battery • Instant Connection
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How GuardianTag Works in <span className="text-[#064E3B]">Seconds</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            Designed for real-world Indian emergencies. Anyone with a smartphone camera can connect with you instantly—no app download required.
          </p>
        </div>

        {/* 3 Step Visual Loop Banner */}
        <div className="mt-14 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#064E3B] font-extrabold text-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <QrCode className="w-8 h-8 text-[#064E3B]" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">STEP 1</span>
                <h3 className="text-xl font-bold text-slate-900">SCAN</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Bystander or finder points any smartphone camera at the GuardianTag on your helmet, bag, or luggage.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF4D4D] font-extrabold text-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <PhoneCall className="w-8 h-8 text-[#FF4D4D]" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-widest">STEP 2</span>
                <h3 className="text-xl font-bold text-slate-900">CONNECT</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Instant browser screen opens with masked call &amp; SMS options. Your personal phone number stays 100% private.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative group">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-8 h-8 text-teal-800" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">STEP 3</span>
                <h3 className="text-xl font-bold text-slate-900">RESPOND</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                You or your emergency contacts receive immediate phone relay call and SMS notification to respond fast.
              </p>
            </div>

          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#064E3B] transition duration-200 group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#064E3B] shadow-xs group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#064E3B] transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#064E3B] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Learn more details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

