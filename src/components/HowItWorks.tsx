'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, PhoneCall, LifeBuoy, Smartphone, CheckCircle2 } from 'lucide-react';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import ScanningBeam from '@/components/cinematic/ScanningBeam';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

const steps = [
  {
    step: '1',
    title: 'Scan',
    description: 'A bystander points any phone camera at your tag. No app to install.',
    icon: QrCode,
  },
  {
    step: '2',
    title: 'Connect',
    description: 'Your emergency page opens with one-tap calling. Your number stays hidden.',
    icon: PhoneCall,
  },
  {
    step: '3',
    title: 'Get help',
    description: 'They reach your family, see first-aid steps and can call 112 or the 1033 highway helpline.',
    icon: LifeBuoy,
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className={SECTION_CLASS}>
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/5 rounded-full blur-[160px] pointer-events-none" />

      <div className={`${CONTAINER_CLASS} space-y-14`}>
        <SectionHeader
          eyebrow="How it works"
          title="Help in three steps."
          muted="No app for anyone."
          intro="The person who finds you doesn't need to download anything or know who you are."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Step selector */}
          <div className="lg:col-span-5 space-y-3" role="tablist" aria-label="How GuardianTag works">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={item.step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left hardware-card p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 focus-visible:outline-2 focus-visible:outline-yellow-400 ${
                    isActive ? '!border-yellow-400/60 bg-white/[0.06]' : 'hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                        isActive ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'
                      }`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        {item.title}
                        <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-neutral-500'}`} />
                      </h3>
                      <p className="text-sm text-neutral-400 pt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual for the selected step */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="hardware-card p-8 sm:p-10 rounded-3xl w-full max-w-xl relative overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between items-center text-center">
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center space-y-6 my-auto"
                >
                  <div className="relative p-4 rounded-3xl bg-black border border-white/20">
                    <PhysicalTag3D size="md" serial="GTB0001" />
                    <ScanningBeam className="absolute inset-0 rounded-3xl" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Scanning with the phone camera</p>
                    <p className="text-sm text-neutral-400">Works on any iPhone or Android phone, no app needed.</p>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col items-center space-y-6 my-auto"
                >
                  <div className="flex items-center justify-center gap-6 w-full py-4">
                    <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                      <PhysicalTag3D size="sm" serial="GTB0001" interactive={false} />
                    </div>
                    <div className="flex-1 h-1 bg-white/20 rounded-full relative overflow-hidden">
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="w-1/3 h-full bg-yellow-400 rounded-full"
                      />
                    </div>
                    <div className="p-4 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl">
                      <Smartphone className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Your emergency page opens</p>
                    <p className="text-sm text-neutral-400">The call goes through GuardianTag, so neither side sees the other&apos;s number.</p>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center space-y-6 my-auto"
                >
                  <div className="p-5 rounded-2xl bg-black border border-white/15 w-full space-y-3 text-left">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">Ready to call</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 rounded-xl bg-white/[0.06] text-white flex justify-between gap-4">
                        <span>Emergency contact</span>
                        <span className="font-semibold">One tap</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.06] text-white flex justify-between gap-4">
                        <span>National helplines (112 / 1033)</span>
                        <span className="font-semibold">One tap</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Help is on the way</p>
                    <p className="text-sm text-neutral-400">Your family is called, and emergency services are one tap away.</p>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-center gap-5 pt-4 border-t border-white/10 w-full">
                {steps.map((s, idx) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`relative h-2.5 rounded-full transition-all before:absolute before:-inset-x-2 before:-inset-y-4 before:content-[''] ${activeStep === idx ? 'bg-yellow-400 w-8' : 'bg-white/30 w-2.5'}`}
                    aria-label={`Show step ${idx + 1}: ${s.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
