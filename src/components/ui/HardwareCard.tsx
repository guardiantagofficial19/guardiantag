'use client';

import React from 'react';

export interface HardwareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  className?: string;
}

export default function HardwareCard({
  children,
  hoverLift = true,
  className = '',
  ...props
}: HardwareCardProps) {
  const liftStyle = hoverLift ? 'transition-all duration-300 hover:-translate-y-1' : '';

  return (
    <div
      className={`hardware-card rounded-3xl p-6 sm:p-8 ${liftStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
