'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { QrCode, Menu, X, User, Info, Package, ArrowRight, Camera, Scan, Shield } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanInput, setScanInput] = useState('');

  const isActive = (path: string) => pathname === path;

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = scanInput.trim().toUpperCase();
    if (!cleanId) return;
    soundEngine.playSuccess();
    setShowScanModal(false);
    setScanInput('');
    router.push(`/tag/${cleanId}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-6 pt-3 sm:pt-4 max-w-7xl mx-auto transition-all duration-300">
      {/* Liquid Glassmorphic Fixed Capsule Header Shell */}
      <div className="relative bg-black/70 backdrop-blur-3xl backdrop-saturate-200 text-white rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,255,255,0.06)] border border-white/20 px-5 sm:px-8 py-3 flex items-center justify-between transition-all duration-300 group">
        
        {/* Specular Liquid Edge Highlight Line */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Brand Logo / Wordmark - GuardianTag Liquid Glass */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" onClick={() => soundEngine.playClick()} className="flex items-center gap-2 group/logo">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover/logo:scale-110 group-hover/logo:bg-white transition-all duration-300 p-1.5">
              <img
                src="/gt-logo.png"
                alt="GT Shield Logo"
                className="w-full h-full object-contain filter brightness-0 invert group-hover/logo:invert-0 transition-all"
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight font-sans bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent group-hover/logo:text-white transition-all">
              GuardianTag
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links (Center) - Liquid Pill Items */}
        <nav className="hidden md:flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider">
          <Link
            href="/products"
            onClick={() => soundEngine.playClick()}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
              isActive('/products')
                ? 'text-white font-extrabold bg-white/20 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] backdrop-blur-md'
                : 'text-neutral-300 hover:text-white hover:bg-white/10 hover:border hover:border-white/20'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-white" />
            <span>Products</span>
          </Link>

          <Link
            href="/register"
            onClick={() => soundEngine.playClick()}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
              isActive('/register')
                ? 'text-white font-extrabold bg-white/20 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] backdrop-blur-md'
                : 'text-neutral-300 hover:text-white hover:bg-white/10 hover:border hover:border-white/20'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-white" />
            <span>Activate QR</span>
          </Link>

          <Link
            href="/about"
            onClick={() => soundEngine.playClick()}
            onMouseEnter={() => soundEngine.playHover()}
            className={`px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
              isActive('/about')
                ? 'text-white font-extrabold bg-white/20 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] backdrop-blur-md'
                : 'text-neutral-300 hover:text-white hover:bg-white/10 hover:border hover:border-white/20'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-white" />
            <span>About Us</span>
          </Link>
        </nav>

        {/* Right Action Button - Liquid Chrome Pill Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/manage"
            onClick={() => soundEngine.playClick()}
            className="text-xs font-extrabold font-mono uppercase tracking-wider px-6 py-2.5 rounded-full bg-gradient-to-r from-white via-neutral-100 to-neutral-300 text-black shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] border border-white/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4 text-black" />
            <span>Login to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden p-2.5 rounded-full bg-white/10 text-white border border-white/25 hover:bg-white/20 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* EMBEDDED CAMERA QR SCANNER MODAL */}
      {showScanModal && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="hardware-card p-8 rounded-3xl border-2 border-white/30 max-w-md w-full space-y-6 text-center shadow-2xl relative">
            
            <div className="flex justify-between items-center border-b border-white/15 pb-4">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-white" />
                <span className="text-xs font-mono font-extrabold text-white uppercase">
                  OPTICAL QR SCANNER
                </span>
              </div>
              <button
                onClick={() => setShowScanModal(false)}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder Mockup */}
            <div className="relative w-full aspect-square bg-black rounded-2xl border-2 border-white/20 overflow-hidden flex flex-col items-center justify-center p-4 gap-3">
              <div className="w-44 h-44 border-2 border-white/40 rounded-xl relative flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] font-mono text-neutral-400 font-bold mb-2">
                  ALIGN GUARDIANTAG QR INSIDE FRAME
                </span>
                <Link
                  href="/scan"
                  onClick={() => setShowScanModal(false)}
                  className="px-4 py-2 rounded-xl bg-yellow-400 text-black text-xs font-mono font-extrabold uppercase shadow-lg hover:bg-yellow-300 transition flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  Launch Camera
                </Link>
                {/* Laser Sweep Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-white shadow-[0_0_15px_#FFFFFF] animate-pulse top-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Test Serial Shortcuts */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                OR QUICK-TEST SAMPLE TAG SERIAL:
              </span>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {['GTB0001', 'GTK0001', 'GTT0001', 'GTU0001'].map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      setShowScanModal(false);
                      router.push(`/tag/${id}`);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center border border-white/20 cursor-pointer"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Serial Input */}
            <form onSubmit={handleManualScanSubmit} className="flex gap-2">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value.toUpperCase())}
                placeholder="Enter Serial (e.g. GTB0001)"
                className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs font-mono uppercase hover:bg-neutral-200 transition cursor-pointer"
              >
                Scan
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Liquid Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-black/90 backdrop-blur-3xl border border-white/25 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-3 font-mono text-sm text-white">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 px-4 rounded-2xl hover:bg-white/15 flex items-center justify-between border border-transparent hover:border-white/20 transition"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-white" />
              <span>Products</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </Link>

          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 px-4 rounded-2xl hover:bg-white/15 flex items-center justify-between border border-transparent hover:border-white/20 transition"
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-white" />
              <span>Activate QR</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 px-4 rounded-2xl hover:bg-white/15 flex items-center justify-between border border-transparent hover:border-white/20 transition"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-white" />
              <span>About Us</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </Link>

          <div className="pt-2">
            <Link
              href="/manage"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3.5 text-center rounded-full bg-gradient-to-r from-white to-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
