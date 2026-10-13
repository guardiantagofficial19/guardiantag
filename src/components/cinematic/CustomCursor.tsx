'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<'default' | 'button' | 'qr' | 'cta'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check element under cursor for cursor state hints
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const magneticElement = target.closest('[data-cursor]');
      if (magneticElement) {
        const type = magneticElement.getAttribute('data-cursor');
        const text = magneticElement.getAttribute('data-cursor-text') || '';
        setCursorText(text);
        if (type === 'button' || type === 'qr' || type === 'cta') {
          setCursorState(type);
          return;
        }
      }

      if (target.closest('button, a, input, select')) {
        setCursorState('button');
        setCursorText('');
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const sizeVariants = {
    default: { width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFFFFF' },
    button: { width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1, borderColor: '#FFFFFF' },
    qr: { width: 56, height: 56, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: '#FFFFFF' },
    cta: { width: 80, height: 80, borderRadius: '50%', backgroundColor: '#FFFFFF', color: '#000000' },
  };

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={sizeVariants[cursorState]}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center font-mono text-[9px] font-extrabold uppercase tracking-widest overflow-hidden shadow-2xl backdrop-blur-xs"
    >
      {cursorText && (
        <span className="px-1 text-center leading-tight">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}
