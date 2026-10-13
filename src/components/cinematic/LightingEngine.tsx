'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function LightingEngine() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Light sweep coordinates based on scroll
  const glowX = useTransform(smoothProgress, [0, 1], ['20%', '80%']);
  const glowY = useTransform(smoothProgress, [0, 1], ['10%', '90%']);
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.12, 0.18, 0.12]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Scroll-driven Ambient Backlight Sweep */}
      <motion.div
        style={{
          left: glowX,
          top: glowY,
          opacity: glowOpacity,
        }}
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full blur-[180px]"
      />

      {/* Mouse Follow Interactive Rim Reflection */}
      <motion.div
        animate={{
          x: mousePos.x - 200,
          y: mousePos.y - 200,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 30 }}
        className="absolute w-[400px] h-[400px] bg-white/5 rounded-full blur-[140px] opacity-40"
      />
    </div>
  );
}
