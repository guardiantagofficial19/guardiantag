'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import GuardianTagCard from '@/components/GuardianTagCard';

interface PhysicalTag3DProps {
  serial?: string;
  tagType?: 'GTB' | 'GTK' | 'GTT' | 'GTU';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  className?: string;
}

export default function PhysicalTag3D({
  serial = 'GTB0001',
  tagType = 'GTB',
  size = 'md',
  interactive = true,
  className = '',
}: PhysicalTag3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt physics for desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    sm: 'w-64 max-w-full',
    md: 'w-80 max-w-full',
    lg: 'w-96 max-w-full',
    xl: 'w-[440px] max-w-full',
  };

  return (
    <motion.div
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative cursor-pointer select-none perspective-1000 ${sizeClasses[size]} ${className}`}
    >
      <div style={{ transform: 'translateZ(20px)' }} className="w-full">
        <GuardianTagCard qrId={serial.startsWith('GT') ? serial : `${tagType}0001`} />
      </div>
    </motion.div>
  );
}
