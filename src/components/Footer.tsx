'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, Mail, MapPin, Eye, Type } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

export default function Footer() {
  const [highContrast, setHighContrast] = useState(false);

  const toggleContrast = () => {
    soundEngine.playClick();
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('wcag-high-contrast');
    } else {
      document.documentElement.classList.remove('wcag-high-contrast');
    }
  };

  return (
    <footer className="bg-black text-white border-t border-white/15 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">
                GuardianTag
              </span>
            </Link>

            <p className="text-xs text-neutral-400 font-normal leading-relaxed max-w-sm">
              GuardianTag provides physical QR personal safety technology engineered for Indian roads, children, travel, and personal belongings. Instant bystander emergency routing with 100% number masking privacy.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Made for Indian Safety Standards • Patent Pending</span>
            </div>
          </div>

          {/* Col 2: Hardware Products */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider">HARDWARE TAGS</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/products#gtb" className="hover:text-white transition">
                  GTB Biker Tag (Helmet)
                </Link>
              </li>
              <li>
                <Link href="/products#gtk" className="hover:text-white transition">
                  GTK Kids Tag (Backpack)
                </Link>
              </li>
              <li>
                <Link href="/products#gtt" className="hover:text-white transition">
                  GTT Traveller Tag (Luggage)
                </Link>
              </li>
              <li>
                <Link href="/products#gtu" className="hover:text-white transition">
                  GTU Universal Decal (Vehicles)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Platform */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider">PLATFORM</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Activate Tag
                </Link>
              </li>
              <li>
                <Link href="/manage" className="hover:text-white transition">
                  Login to Dashboard
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-white transition">
                  Public Emergency Demo
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition font-bold text-white">
                  Admin Control Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Contact */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider">SUPPORT</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                <span>support@guardiantag.com</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-white shrink-0" />
                <span>+91 1800 200 4892</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ACCESSIBILITY & CONTRAST CONTROL BAR (UI-UX PRO MAX) */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-neutral-300 font-bold">
            <Eye className="w-4 h-4 text-white" />
            <span>WCAG AAA ACCESSIBILITY SUITE:</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleContrast}
              className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase cursor-pointer transition flex items-center gap-1.5 ${
                highContrast ? 'bg-white text-black border-white' : 'bg-black text-white border-white/20 hover:border-white/40'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{highContrast ? 'High Contrast Active' : 'Enable High Contrast'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} GuardianTag Technologies India. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer font-bold">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Protocol</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
