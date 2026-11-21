import React from 'react';

/**
 * Shared header for every landing-page section, so they all read as one product:
 * small yellow label -> large heading (optional muted second line) -> short intro.
 */
export default function SectionHeader({
  eyebrow,
  title,
  muted,
  intro,
  align = 'center',
  className = '',
}: {
  eyebrow: string;
  title: React.ReactNode;
  /** Optional second half of the heading, shown in grey. */
  muted?: React.ReactNode;
  intro?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'text-center mx-auto' : 'text-left'} max-w-3xl space-y-4 ${className}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-yellow-400">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
        {title}
        {muted && (
          <>
            {' '}
            <span className="text-neutral-500">{muted}</span>
          </>
        )}
      </h2>
      {intro && (
        <p className={`text-base sm:text-lg text-neutral-400 leading-relaxed ${centered ? 'mx-auto' : ''} max-w-2xl`}>
          {intro}
        </p>
      )}
    </div>
  );
}

/** Standard section spacing and container used by every landing section. */
export const SECTION_CLASS = 'relative bg-black text-white py-20 sm:py-28 border-b border-white/10 overflow-hidden scroll-mt-20';
export const CONTAINER_CLASS = 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
