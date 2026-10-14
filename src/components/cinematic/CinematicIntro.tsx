'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicIntro({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState<number>(0);
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated with latest onComplete callback without triggering useEffect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Stage 0: Initial text glow & laser scan line across screen center
    // Stage 1: Screen splits into Top and Bottom halves sliding apart (1.2s)
    // Stage 2: Fade out overlay & reveal main website (2.5s)
    
    const timer1 = setTimeout(() => setStage(1), 600);
    const timer2 = setTimeout(() => setStage(2), 1400);
    const timer3 = setTimeout(() => {
      setIsDone(true);
      onCompleteRef.current?.();
    }, 1800);

    // Hard Failsafe Safety Net: Ensure main website becomes visible within 2s
    const fallbackTimer = setTimeout(() => {
      setIsDone(true);
      onCompleteRef.current?.();
    }, 2000);

    // ESC key listener for instant skip on desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDone(true);
        onCompleteRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Run ONLY ONCE on mount

  const handleSkip = () => {
    setIsDone(true);
    onCompleteRef.current?.();
  };

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 2 ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 z-[10000] select-none overflow-hidden transition-colors ${
          stage >= 1 ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        
        {/* Skip Intro Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="pointer-events-auto absolute top-4 right-4 sm:top-8 sm:right-8 text-xs font-mono font-bold text-neutral-300 hover:text-white uppercase tracking-wider px-4 py-2.5 rounded-full border border-white/30 bg-black/85 backdrop-blur-md z-[10002] transition cursor-pointer active:scale-95 shadow-lg"
          style={{ touchAction: 'manipulation' }}
        >
          SKIP INTRO
        </button>

        {/* TOP CURTAIN HALF */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: stage >= 1 ? '-100%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute top-0 left-0 right-0 h-1/2 bg-black border-b border-white/20 z-[10001] flex flex-col justify-end items-center pb-0 overflow-hidden pointer-events-none"
        >
          {/* Top Half of Massive GuardianTag Display Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="translate-y-[50%] flex flex-col items-center"
          >
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-[0.3em] uppercase mb-4 block">
              PERSONAL SAFETY HARDWARE
            </span>
            <div className="font-bebas text-6xl sm:text-9xl md:text-[140px] tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-none select-none">
              GUARDIANTAG
            </div>
          </motion.div>

          {/* Razor Laser Beam Line on Split Edge */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_30px_#FFFFFF]" />
        </motion.div>

        {/* BOTTOM CURTAIN HALF */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: stage >= 1 ? '100%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-black border-t border-white/20 z-[10001] flex flex-col justify-start items-center pt-0 overflow-hidden pointer-events-none"
        >
          {/* Razor Laser Beam Line on Split Edge */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_30px_#FFFFFF]" />

          {/* Bottom Half of Massive GuardianTag Display Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="-translate-y-[50%] flex flex-col items-center"
          >
            <div className="font-bebas text-6xl sm:text-9xl md:text-[140px] tracking-[0.1em] sm:tracking-[0.14em] text-white uppercase leading-none select-none">
              GUARDIANTAG
            </div>
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase mt-4 block">
              EMERGENCY QR TECH
            </span>
          </motion.div>
        </motion.div>

        {/* CENTER REVEAL ACCENT GLOW */}
        {stage === 0 && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-white shadow-[0_0_50px_10px_#FFFFFF] z-[10001] pointer-events-none"
          />
        )}

      </motion.div>
    </AnimatePresence>
  );
}
