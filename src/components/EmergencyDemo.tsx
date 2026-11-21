'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneCall, MapPin, Lock, QrCode, RotateCcw, HeartPulse } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import ScanningBeam from '@/components/cinematic/ScanningBeam';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

const HELPLINES: [string, string][] = [
  ['National emergency', '112'],
  ['Highway helpline', '1033'],
  ['Ambulance', '108'],
  ['Police', '100'],
];

export default function EmergencyDemo() {
  const [scanned, setScanned] = useState(false);

  return (
    <section id="emergency" className={SECTION_CLASS}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 rounded-full blur-[180px] pointer-events-none" />

      <div className={`${CONTAINER_CLASS} space-y-14`}>
        <SectionHeader
          eyebrow="Live preview"
          title="See what a bystander sees."
          intro="This is the page that opens when someone scans your tag. Try it: simulate a scan."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: the tag and the trigger */}
          <div className="lg:col-span-5">
            <div className="hardware-card p-6 sm:p-8 rounded-3xl space-y-6 text-center">
              <div className="flex justify-center relative">
                <PhysicalTag3D size="md" serial="GTB0001" />
                {scanned && <ScanningBeam className="absolute inset-0 rounded-3xl" />}
              </div>

              <button
                type="button"
                onClick={() => setScanned(!scanned)}
                className={`w-full py-3.5 rounded-full font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                  scanned
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
                    : 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-500/20'
                }`}
              >
                {scanned ? <RotateCcw className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                <span>{scanned ? 'Reset' : 'Simulate a scan'}</span>
              </button>

              <p className="text-sm text-neutral-400 leading-relaxed">
                In real life, any phone camera opens this page. Nothing to install, nothing to sign up for.
              </p>
            </div>
          </div>

          {/* Right: phone preview of the emergency page */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div
                className={`rounded-[40px] border-4 border-white/25 shadow-2xl bg-black p-6 sm:p-7 space-y-6 transition-all duration-500 ${
                  scanned ? 'opacity-100' : 'opacity-40 blur-[1px]'
                }`}
                aria-hidden={!scanned}
              >
                {/* Status bar */}
                <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-white/10 pb-4">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Emergency page
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Number hidden
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-neutral-500">GuardianTag · Biker tag</p>
                  <h4 className="text-2xl font-extrabold text-white tracking-tight">GTB0001</h4>
                </div>

                <div className="space-y-3">
                  <div className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center gap-3">
                    <PhoneCall className="w-5 h-5" />
                    Call emergency contact
                  </div>
                  <div className="w-full py-3.5 rounded-2xl bg-white/10 text-white border border-white/15 font-semibold text-sm flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Share location with family
                  </div>
                </div>

                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2 text-left">
                  <HeartPulse className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    <span className="font-semibold">Blood group O+.</span> Allergic to penicillin.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 text-left">
                  <p className="text-xs text-neutral-500">Helplines in India</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {HELPLINES.map(([label, num]) => (
                      <div key={num} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 flex justify-between">
                        <span>{label}</span>
                        <span className="font-bold text-yellow-400 tabular-nums">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {!scanned && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="rounded-full bg-black/80 border border-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                      Scan the tag to open this page
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
