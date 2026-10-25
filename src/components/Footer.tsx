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
              <span>Personal Safety Technology • India</span>
            </div>
          </div>

          {/* Col 2: Hardware Products */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-extrabold text-white uppercase tracking-wider">HARDWARE TAGS</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/products#gtb" className="hover:text-white transition">
                  GTB Biker Tag (Helmet & Bike)
                </Link>
              </li>
              <li>
                <Link href="/products#gtk" className="hover:text-white transition">
                  GTK Kids Tag (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/products#gtt" className="hover:text-white transition">
                  GTT Traveller Tag (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/products#gtu" className="hover:text-white transition">
                  GTU Universal Decal (Coming Soon)
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
                  Manage My Tag
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-white transition">
                  Emergency Scanner
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About GuardianTag
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
                <a href="mailto:support@guardiantag.in" className="hover:text-white transition">
                  support@guardiantag.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-white shrink-0" />
                <a href="https://wa.me/918058800880" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  WhatsApp Support (+91 80588 00880)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} GuardianTag. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/security" className="hover:text-white transition">Security Protocol</Link>
            <Link href="/admin" className="text-neutral-500 hover:text-white transition">Store Manager</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
