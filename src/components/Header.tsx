'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, QrCode, ShoppingBag, Lock, Menu, X, PhoneCall } from 'lucide-react';
import CredentialsModal from './CredentialsModal';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Header({ cartCount = 0, onOpenCart }: HeaderProps) {
  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner - Deep Safety Emerald */}
      <div className="bg-[#064E3B] text-white text-xs py-2.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <strong>India&apos;s Preferred QR Safety Tag</strong> — 1-Second Encrypted Emergency Connection | No App Download Needed
        </span>
        <span className="hidden sm:inline-flex bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-white/30">
          FREE EXPRESS SHIPPING 🇮🇳
        </span>
      </div>

      {/* Main Sticky Navbar - Warm Ceramic Glass */}
      <header className="sticky top-0 z-40 glass-header border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#0D9488] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center font-sans">
                GUARDIAN<span className="text-[#FF4D4D]">TAG</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase">
                Personal Safety Protocol
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
            <a href="#how-it-works" className="hover:text-[#064E3B] transition-colors">
              How It Works
            </a>
            <a href="#variants" className="hover:text-[#064E3B] transition-colors">
              Tag Scenarios
            </a>
            <a href="#products" className="hover:text-[#064E3B] transition-colors">
              Shop Tags
            </a>
            <a href="#comparison" className="hover:text-[#064E3B] transition-colors">
              Why GuardianTag
            </a>
            <a href="#simulator" className="hover:text-[#064E3B] transition-colors flex items-center gap-1.5 text-emerald-800 font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-[#FF4D4D]" />
              Live Demo
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            {/* Credentials Modal Trigger */}
            <button
              onClick={() => setIsCredsOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              title="Configure API Keys"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Keys</span>
            </button>

            {/* Manage Tag */}
            <Link
              href="/manage"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              <span>Manage Tag</span>
            </Link>

            {/* Activate Tag */}
            <Link
              href="/register"
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#04392a] text-white shadow-md shadow-emerald-950/10 transition transform hover:-translate-y-0.5"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Activate Tag</span>
            </Link>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D4D] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 text-sm font-semibold text-slate-800">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2">
              How It Works
            </a>
            <a href="#variants" onClick={() => setMobileMenuOpen(false)} className="block py-2">
              Tag Scenarios (GTB, GTK, GTT, GTU)
            </a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block py-2">
              Shop Tags
            </a>
            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block py-2">
              Why GuardianTag
            </a>
            <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-800 font-bold">
              Live Emergency Demo
            </a>
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/manage"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left py-2 text-xs font-bold text-slate-700"
              >
                Manage My Registered Tag
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCredsOpen(true);
                }}
                className="w-full text-left py-2 text-xs font-bold text-[#FF4D4D] flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Configure API Credentials
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Credentials Modal Popup */}
      <CredentialsModal isOpen={isCredsOpen} onClose={() => setIsCredsOpen(false)} />
    </>
  );
}

