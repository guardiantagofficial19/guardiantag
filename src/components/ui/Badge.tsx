'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'subtle';
  icon?: React.ReactNode;
  className?: string;
}

export default function Badge({
  children,
  variant = 'outline',
  icon,
  className = '',
}: BadgeProps) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider';

  const variants = {
    outline: 'bg-white/10 text-white border border-white/20',
    solid: 'bg-white text-black font-extrabold',
    subtle: 'bg-white/5 text-neutral-400 border border-white/10',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`.trim()}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
