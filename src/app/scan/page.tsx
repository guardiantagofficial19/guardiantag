'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, RefreshCw, X, Shield, Zap, Sparkles } from 'lucide-react';

export default function MobileScanPage() {
  const router = useRouter();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let html5QrcodeScanner: any = null;

    async function startScanner() {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        
        html5QrcodeScanner = new Html5QrcodeScanner(
          'qr-reader',
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true
          },
          /* verbose= */ false
        );

        html5QrcodeScanner.render(
          (decodedText: string) => {
            // Extracted QR payload
            let cleanId = decodedText.trim();
            if (cleanId.includes('id=')) {
              cleanId = cleanId.split('id=')[1].split('&')[0];
            } else if (cleanId.includes('/tag/')) {
              cleanId = cleanId.split('/tag/')[1].split('?')[0];
            } else if (cleanId.includes('/s/')) {
              cleanId = cleanId.split('/s/')[1].split('?')[0];
            }

            cleanId = cleanId.toUpperCase();
            if (html5QrcodeScanner) {
              html5QrcodeScanner.clear();
            }
            router.push(`/emergency?id=${encodeURIComponent(cleanId)}`);
          },
          (error: any) => {
            // Scanning in progress
          }
        );

        scannerRef.current = html5QrcodeScanner;
        setCameraActive(true);
      } catch (err: any) {
        setCameraError('Camera access required. Please allow camera permissions or enter Tag ID manually below.');
      }
    }

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch {
          // Cleanup
        }
      }
    };
  }, [router]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const cleanId = manualInput.trim().toUpperCase();
    router.push(`/emergency?id=${encodeURIComponent(cleanId)}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <a href="/" className="flex items-center gap-2 text-white">
          <Image src="/gt-shield-logo.png" alt="GT Logo" width={28} height={28} className="invert filter" />
          <span className="font-extrabold text-base font-mono">GuardianTag <span className="text-yellow-400 font-normal">Scanner</span></span>
        </a>
        <a href="/" className="p-2 rounded-full bg-neutral-900 border border-white/15 text-neutral-400 hover:text-white">
          <X className="w-5 h-5" />
        </a>
      </div>

      {/* Camera Stage */}
      <div className="my-auto flex flex-col items-center justify-center space-y-6 max-w-md mx-auto w-full">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Live Camera Scanner
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Point Camera at GuardianTag</h1>
          <p className="text-xs text-neutral-400">Position the physical QR code inside the viewfinder window</p>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative w-full max-w-xs aspect-square rounded-3xl bg-neutral-900/90 border-2 border-yellow-400/60 p-4 shadow-[0_0_40px_rgba(250,204,21,0.2)] overflow-hidden flex flex-col items-center justify-center">
          <div id="qr-reader" className="w-full h-full overflow-hidden rounded-2xl" />

          {cameraError && (
            <div className="p-4 text-center space-y-2 z-10">
              <Camera className="w-8 h-8 text-yellow-400 mx-auto opacity-60" />
              <p className="text-xs text-neutral-300">{cameraError}</p>
            </div>
          )}
        </div>

        {/* Manual Fallback Input */}
        <form onSubmit={handleManualSubmit} className="w-full space-y-2 pt-2">
          <label className="block text-xs font-mono text-neutral-400 text-center">OR ENTER TAG SERIAL ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. GTB0002"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 bg-neutral-900 border border-white/20 rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-yellow-400 text-sm"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-extrabold text-xs font-mono uppercase hover:bg-yellow-300 transition"
            >
              Open
            </button>
          </div>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] font-mono text-neutral-500 pt-4 border-t border-white/10">
        GUARDIANTAG MOBILE SCANNER • INSTANT APP-FREE SYNC
      </div>
    </div>
  );
}
