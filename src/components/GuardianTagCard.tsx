'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface GuardianTagCardProps {
  qrId?: string;
  className?: string;
  fgColor?: string;
  bgColor?: string;
  subtext?: string;
}

export default function GuardianTagCard({
  qrId = 'GTB0001',
  className = '',
  fgColor = '#000000',
  bgColor = '#FFFFFF',
  subtext = 'SCAN TO CONNECT',
}: GuardianTagCardProps) {
  const [qrSvg, setQrSvg] = useState<string>('');
  const scanUrl = `http://localhost:3000/tag/${qrId}`;

  useEffect(() => {
    QRCode.toString(scanUrl, {
      type: 'svg',
      margin: 1,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((svg) => setQrSvg(svg))
      .catch((err) => console.error('QR Generation Error:', err));
  }, [scanUrl, fgColor, bgColor]);

  return (
    <div
      className={`relative w-full aspect-square rounded-3xl p-6 shadow-2xl border flex flex-col items-center justify-between select-none ${className}`}
      style={{ backgroundColor: bgColor, borderColor: fgColor }}
    >
      {/* 100% Real Scannable Standard QR Code */}
      <div className="w-full aspect-square p-2 rounded-2xl flex items-center justify-center">
        {qrSvg ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 animate-pulse rounded-xl" />
        )}
      </div>

      {/* Serial ID Label & Subtext */}
      <div className="mt-3 text-center">
        <span
          className="text-base font-mono font-black tracking-widest uppercase block"
          style={{ color: fgColor }}
        >
          {qrId}
        </span>
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-75"
          style={{ color: fgColor }}
        >
          {subtext}
        </span>
      </div>
    </div>
  );
}
