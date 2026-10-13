'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ScanningBeam({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated Vertical Laser Sweep Line */}
      <motion.div
        animate={{
          top: ['0%', '100%', '0%'],
          opacity: [0.3, 0.9, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_#FFFFFF] z-20 pointer-events-none"
      />
    </div>
  );
}
