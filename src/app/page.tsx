'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import ExplodedView3D from '@/components/cinematic/ExplodedView3D';
import EmergencyDemo from '@/components/EmergencyDemo';
import PrivacyDisintegration from '@/components/cinematic/PrivacyDisintegration';
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  PhoneCall,
  QrCode,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  Truck,
  RotateCcw,
  Package,
  Award,
  Radio,
  Clock,
  HelpCircle,
  Eye,
  Sliders,
  ExternalLink,
} from 'lucide-react';

const GEAR_COMPATIBILITY = [
  'AGV HELMETS',
  'ARAI HELMETS',
  'SHOEI JAPAN',
  'MT HELMETS',
  'SMK HELMETS',
  'ROYAL ENFIELD HIMALAYAN',
  'KTM DUKE 390',
  'TRIUMPH SPEED 400',
  'KAWASAKI NINJA',
  'BMW MOTORRAD',
  'YAMAHA R15 V4',
  'DUCATI PANIGALE',
];

const HARDWARE_PORTFOLIO = [
  {
    id: '01',
    code: 'GTB',
    name: 'GTB Biker Tag — 4-Piece Emergency Safety Kit',
    category: 'Motorcycle & Helmet Safety Hardware',
    status: 'ACTIVE LAUNCH',
    statusColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    price: '₹499',
    comparePrice: '₹999',
    headline: 'Curved aerodynamic PVC helmet tag + stainless steel braided keyring tag.',
    description:
      'Engineered specifically for motorcyclists and superbike riders. In an accident, any bystander or paramedic scans the high-contrast QR with any smartphone camera to trigger an instant masked SOS call without revealing the rider’s private phone number.',
    specs: [
      '1x Curved High-Impact PVC Helmet Tag (150 km/h wind shear rated)',
      '1x Stainless Braided Wire Loop Keyring Hardware Tag',
      '2x All-Weather Reflective Decals (Visor & Swingarm mounts)',
      '3M Military VHB High-Tack Adhesive Wipe included',
    ],
    link: '/products?model=GTB',
  },
  {
    id: '02',
    code: 'GTK',
    name: 'GTK Kids & School Safety Bundle',
    category: 'Child & Backpack Protection Hardware',
    status: 'LAUNCHING SHORTLY',
    statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    price: '₹399',
    comparePrice: '₹799',
    headline: '10-piece guardian protection for backpacks, shoes & uniforms.',
    description:
      'A complete safety hardware kit for school kids, toddlers, and field trips. If a child is separated in a crowded mall or school outing, security guards or citizens can scan the badge to reach parents instantly via masked proxy.',
    specs: [
      '4x Waterproof Mini QR Stickers (Lunch boxes & water bottles)',
      '1x Soft Silicone Backpack Tag with snap carabiner',
      '1x Uniform & Jacket Safety Badge',
      '4x Heat-Seal Iron-On Permanent Fabric Decals',
    ],
    link: '/products?model=GTK',
  },
  {
    id: '03',
    code: 'GTT',
    name: 'GTT Traveller Smart Luggage Tag',
    category: 'Airport Baggage & Global Travel Recovery',
    status: 'LAUNCHING SHORTLY',
    statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    price: '₹449',
    comparePrice: '₹899',
    headline: 'Aircraft-grade anodized aluminum tag with threaded steel wire cable.',
    description:
      'Engineered for international flyers and frequent travellers. The aircraft-grade aluminum frame withstands airport carousels while shielding personal home addresses and phone numbers from public view.',
    specs: [
      'Braided stainless steel cable lock with brass barrel',
      'Instant scan location alert sent to your WhatsApp & email',
      'Works in 190+ countries with zero app download required',
      'Anodized scratch-proof matte casing with laser-etched matrix',
    ],
    link: '/products?model=GTT',
  },
  {
    id: '04',
    code: 'GTU',
    name: 'GTU Universal Multi-Surface Decals',
    category: 'Multi-Surface Everyday Asset Protection',
    status: 'LAUNCHING SHORTLY',
    statusColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    price: '₹299',
    comparePrice: '₹599',
    headline: 'Prismatic reflective vinyl decals for car windshields, laptops & gear.',
    description:
      'All-weather reflective safety decals for cars, laptops, camera gear, and keychains. Enables instant anonymous voice proxy when your vehicle is parked or when assets are misplaced.',
    specs: [
      'Universal application on car windshields, scooters & laptops',
      'Residue-free 3M removable adhesive (leaves zero glue marks)',
      'Prismatic micro-reflectors illuminate under headlights at 100 meters',
      'Anonymous two-way voice proxy for urgent parking calls',
    ],
    link: '/products?model=GTU',
  },
];

const LIFECYCLE_STEPS = [
  {
    phase: 'PHASE 01',
    title: 'Incident & Roadside Discovery',
    tag: 'T = 0s',
    desc: 'In an accident, any bystander, fellow rider, or paramedic immediately notices the high-contrast yellow/black GuardianTag mounted on the rider’s helmet curve or bike keyring.',
    icon: Eye,
  },
  {
    phase: 'PHASE 02',
    title: 'Zero-App Optical Scan',
    tag: 'T + 1.2s',
    desc: 'The bystander points their standard iPhone or Android camera at the QR code. No app download, account creation, or login is required. The emergency portal loads in under 1 second.',
    icon: QrCode,
  },
  {
    phase: 'PHASE 03',
    title: 'Encrypted Emergency Profile',
    tag: 'T + 2.0s',
    desc: 'Critical medical parameters appear instantly on screen: Blood Group (e.g., O+ Positive), Known Medical Allergies, Emergency SOS Contacts, and Vehicle Insurance details.',
    icon: Shield,
  },
  {
    phase: 'PHASE 04',
    title: 'Masked Cloud Voice Proxy Relay',
    tag: 'T + 2.8s',
    desc: 'Tapping “Call Emergency Contact” dials through our Twilio cloud voice relay. The bystander and emergency contact connect immediately without ever seeing each other’s personal mobile numbers.',
    icon: PhoneCall,
  },
];

const VERIFIED_TESTIMONIALS = [
  {
    author: 'Vikram Sengupta',
    role: 'KTM Duke 390 Rider • Bangalore',
    rating: 5,
    quote:
      'The 3M adhesive is genuinely military grade. Stuck it onto my AGV helmet and rode through torrential Western Ghats monsoons at highway speeds—did not budge a millimetre. Paramedic scan test triggered an instant call to my brother without showing my phone number.',
  },
  {
    author: 'Aditya Sharma',
    role: 'Royal Enfield Himalayan 450 Tourer • Leh Rider',
    rating: 5,
    quote:
      'Took the 4-piece kit on my Manali-Leh circuit. Sub-zero temperatures, water crossings, dust storms—the tag still looks factory fresh. The keychain tag is heavy-duty and never gets scratched by bike keys.',
  },
  {
    author: 'Pooja Nair',
    role: 'Triumph Speed 400 Commuter • Mumbai',
    rating: 5,
    quote:
      'Setup took literally 45 seconds. Scanned the box, added my emergency contact & blood group (O+), and it was active. Knowing that someone can reach my family in an emergency without having my private number is unbeatable.',
  },
  {
    author: 'Rahul Deshmukh',
    role: 'Yamaha R15 Track Rider • Pune',
    rating: 5,
    quote:
      'The curved shape hugs helmet contours cleanly without looking like a random bulky sticker. The yellow and black finish looks premium and factory-installed. Super fast 2-day delivery to Pune!',
  },
];

const FAQS = [
  {
    q: 'Do I need to pay any monthly or annual subscription fee?',
    a: 'No! GuardianTag is a one-time purchase of ₹499. There are zero monthly charges, zero yearly renewal fees, and zero hidden server costs.',
  },
  {
    q: 'What happens when someone scans my helmet QR code?',
    a: 'Any smartphone camera instantly opens your verified GuardianTag profile. It displays your emergency contacts, blood group, allergies, and bike registration. The scanner can press "Call Emergency Contact" which connects via a masked relay without ever revealing your personal phone number.',
  },
  {
    q: 'Will high pressure water washing or monsoon rain peel the tag off?',
    a: 'No. GuardianTag uses authentic 3M high-tack VHB structural adhesive. It is rated for 150 km/h wind shear, intense monsoons, and industrial 120-bar motorcycle pressure washes once cured for 12 hours.',
  },
  {
    q: 'Can I change my emergency contact number later if I change phones?',
    a: 'Yes, absolutely. You can log into your GuardianTag Owner Portal at any time using your registered phone number or QR ID to update your emergency contacts, medical information, or vehicle details instantly.',
  },
];

export default function SpectupStyledHomePage() {
  const [activePortfolioTab, setActivePortfolioTab] = useState('01');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      <Navbar />

      {/* ===================================================================== */}
      {/* 0. ATMOSPHERIC CINEMATIC HERO SECTION (Spectup 'kh' Stage)            */}
      {/* ===================================================================== */}
      <section className="relative min-h-[92vh] sm:min-h-[100vh] flex flex-col justify-center items-center bg-black pt-32 sm:pt-40 pb-20 border-b border-white/10 overflow-hidden">
        
        {/* Ambient Fog / Radial Backlight */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-gradient-to-b from-yellow-400/10 via-white/5 to-transparent rounded-full blur-[160px] pointer-events-none" />

        {/* Micro Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-8">
          
          {/* Spectup-style Micro Index Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-bold text-neutral-300">
            <span className="text-yellow-400">/ 00</span>
            <span className="text-neutral-500">•</span>
            <span className="tracking-widest uppercase">GUARDIANTAG SAFETY HARDWARE LABS</span>
          </div>

          {/* Large Authoritative Editorial Title */}
          <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.05] sm:leading-[1.02]">
              Next-gen emergency hardware: Built for Indian roads &amp; zero&#8209;privacy compromise.
            </h1>
            <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto font-sans font-normal leading-relaxed">
              Curved aerodynamic PVC helmet tags, high-impact keychains, and masked emergency call relay. Instant paramedic scan with zero apps required.
            </p>
          </div>

          {/* Minimalist Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Order Biker Kit — ₹499</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <a
              href="https://wa.me/918058800880?text=Hello%20GuardianTag!%20I%20want%20to%20order%20the%20GTB%20Biker%20Kit%20for%20%E2%82%B9499.%20Please%20share%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>⚡ Order on WhatsApp in 30s</span>
            </a>
          </div>

          {/* Social Proof & Value Micro-Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-1.5">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9/5 Rating</span>
              <span className="text-neutral-500">(184 Verified Riders)</span>
            </div>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Masked Cloud Relay</span>
            </div>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Zero Monthly Subscriptions</span>
            </div>
          </div>

          {/* Centered Interactive 3D GuardianTag Specimen */}
          <div className="pt-6 flex flex-col items-center justify-center">
            <div className="scale-95 sm:scale-105 transition-transform">
              <PhysicalTag3D serial="GTB8800" tagType="GTB" size="lg" />
            </div>
            <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400">
              <RotateCcw className="w-3 h-3 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Interactive 3D Hardware Specimen • Hover or drag to inspect</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 1. SPECTUP TRACK RECORD & BIG NUMBERS SECTION (The `.big` Matrix)     */}
      {/* ===================================================================== */}
      <section className="py-20 bg-[#060606] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
                / 01 GUARDIANTAG TRACK RECORD
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Engineered for impact. Tested at 150 km/h wind shear.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-sm">
              Critical hardware benchmarks measured across 180+ active rider deployments on Indian roads.
            </p>
          </div>

          {/* The Big 4-Metric Grid (Spectup signature presentation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-neutral-950 border border-white/10 space-y-3 relative group hover:border-yellow-400/50 transition">
              <span className="text-xs font-mono text-neutral-400 block uppercase">Hardware Investment</span>
              <div className="text-4xl sm:text-5xl font-extrabold text-yellow-400 font-mono">₹499</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                One-time complete 4-piece kit cost. Zero monthly fees, zero yearly renewals forever.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-950 border border-white/10 space-y-3 relative group hover:border-emerald-400/50 transition">
              <span className="text-xs font-mono text-neutral-400 block uppercase">Wind Shear Rated</span>
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">150 km/h</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Aerodynamically proven with 3M military-grade structural VHB adhesive tape.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-950 border border-white/10 space-y-3 relative group hover:border-cyan-400/50 transition">
              <span className="text-xs font-mono text-neutral-400 block uppercase">Optical Scan Speed</span>
              <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 font-mono">&lt; 2.8s</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Average paramedic camera scan-to-emergency contact voice proxy connection time.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-950 border border-white/10 space-y-3 relative group hover:border-purple-400/50 transition">
              <span className="text-xs font-mono text-neutral-400 block uppercase">Privacy Security</span>
              <div className="text-4xl sm:text-5xl font-extrabold text-purple-400 font-mono">100%</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Rider mobile numbers completely masked via cloud proxy. Zero PII leakage to bystanders.
              </p>
            </div>
          </div>

          {/* Marquee Ticker: Compatible Gear & Machines */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest block text-center">
              DEPLOYED ACROSS LEADING HELMET BRANDS &amp; MOTORCYCLES
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-mono font-bold text-neutral-400">
              {GEAR_COMPATIBILITY.map((gear, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition"
                >
                  {gear}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. SPECTUP SERVICE LIST / HARDWARE PORTFOLIO SECTION                  */}
      {/* ===================================================================== */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
              / 02 PHYSICAL HARDWARE LINEUP
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              A safety ecosystem built for riders, students &amp; assets.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-sans">
              Every GuardianTag piece is linked to your single encrypted profile. Choose the hardware configuration for your lifestyle.
            </p>
          </div>

          {/* Spectup-style Interactive Accordion / Portfolio Switcher */}
          <div className="space-y-4">
            {HARDWARE_PORTFOLIO.map((item) => {
              const isOpen = activePortfolioTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-yellow-400/60 bg-neutral-950/90 shadow-2xl'
                      : 'border-white/10 bg-neutral-950/40 hover:border-white/20 hover:bg-neutral-950'
                  }`}
                >
                  {/* Top Bar / Accordion Header */}
                  <div
                    onClick={() => setActivePortfolioTab(isOpen ? '' : item.id)}
                    className="p-6 sm:p-8 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <span className="font-mono text-sm font-black text-yellow-400">{item.id}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-xs text-neutral-400 uppercase">
                            [{item.code}]
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-extrabold text-white mt-1 truncate">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="text-right font-mono hidden sm:block">
                        <div className="text-xl font-bold text-white">{item.price}</div>
                        <del className="text-xs text-neutral-500">{item.comparePrice}</del>
                      </div>
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-white/20 text-white'
                      }`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Drawer */}
                  {isOpen && (
                    <div className="p-6 sm:p-8 pt-0 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-base font-bold text-yellow-400 font-mono">
                          {item.headline}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="pt-2">
                          <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                            WHAT&apos;S IN THE BOX:
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-300">
                            {item.specs.map((sp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                <span>{sp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-5 p-6 rounded-2xl bg-black border border-white/15 space-y-4">
                        <div className="flex items-baseline justify-between font-mono">
                          <span className="text-xs text-neutral-400">INTRODUCTORY SALE</span>
                          <span className="text-2xl font-black text-yellow-400">{item.price}</span>
                        </div>

                        <Link
                          href={item.link}
                          className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-yellow-400/20"
                        >
                          <Package className="w-4 h-4" />
                          <span>View Product &amp; Order Kit</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>

                        <div className="text-[11px] font-mono text-neutral-400 space-y-1">
                          <div className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Free Pan-India Express Delivery (2-4 Days)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-cyan-400" />
                            <span>1-Year All-Weather Free Replacement Guarantee</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. SPECTUP PROCESS LIFECYCLE SECTION (How Emergency Call Relay Runs)  */}
      {/* ===================================================================== */}
      <section className="py-24 bg-[#060606] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
                / 03 THE INCIDENT LIFECYCLE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                How emergency calling runs through our encrypted proxy.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-sm">
              Standard QR codes expose your private phone number to anyone. GuardianTag operates as an encrypted voice bridge.
            </p>
          </div>

          {/* 4 Sequential Architectural Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LIFECYCLE_STEPS.map((st, i) => {
              const IconComp = st.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-neutral-950 border border-white/10 space-y-4 relative group hover:border-yellow-400/40 transition"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-xs font-bold text-yellow-400">{st.phase}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-bold">
                      {st.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-yellow-400 transition">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white font-mono">{st.title}</h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Integrated Interactive Live Emergency Calling Simulator */}
          <div className="pt-8">
            <EmergencyDemo />
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. SPECTUP SYSTEM ARCHITECTURE COMPARED SECTION                      */}
      {/* ===================================================================== */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
              / 04 SYSTEM ARCHITECTURE COMPARED
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              GuardianTag hardware compared to generic stickers.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-sans">
              Most emergency tags sold online are thin paper stickers printed with your private telephone number. Here is how GuardianTag differs.
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse border border-white/10 rounded-3xl overflow-hidden bg-neutral-950">
              <thead>
                <tr className="border-b border-white/15 bg-white/5">
                  <th className="p-5 text-neutral-400 font-bold uppercase">Capability</th>
                  <th className="p-5 text-yellow-400 font-bold uppercase bg-yellow-400/10">
                    GuardianTag GTB Kit (₹499)
                  </th>
                  <th className="p-5 text-neutral-500 font-bold uppercase">Generic Amazon QR Stickers</th>
                  <th className="p-5 text-neutral-500 font-bold uppercase">Medical ID Bracelets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-neutral-300">
                <tr>
                  <td className="p-5 font-bold text-white">Cloud Call Proxy</td>
                  <td className="p-5 font-bold text-emerald-400 bg-yellow-400/5">
                    ✓ Masked Relay (Zero PII leakage)
                  </td>
                  <td className="p-5 text-red-400">✗ Raw phone number exposed to all</td>
                  <td className="p-5 text-neutral-400">Phone number etched in plain text</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Adhesive Rating</td>
                  <td className="p-5 font-bold text-emerald-400 bg-yellow-400/5">
                    ✓ 3M Military VHB (150 km/h wind shear)
                  </td>
                  <td className="p-5 text-neutral-400">Standard paper adhesive (peels in rain)</td>
                  <td className="p-5 text-neutral-400">N/A (Wearable strap)</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Monsoon Waterproofing</td>
                  <td className="p-5 font-bold text-emerald-400 bg-yellow-400/5">
                    ✓ IP68 Waterproof + UV Shield
                  </td>
                  <td className="p-5 text-neutral-400">Ink fades after 2-3 weeks of rain</td>
                  <td className="p-5 text-neutral-400">Waterproof but easily forgotten at home</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Live Data Updates</td>
                  <td className="p-5 font-bold text-emerald-400 bg-yellow-400/5">
                    ✓ Update contacts anytime via portal
                  </td>
                  <td className="p-5 text-neutral-400">Permanent (Requires buying a new sticker)</td>
                  <td className="p-5 text-neutral-400">Requires purchasing a new metal band</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Subscription Costs</td>
                  <td className="p-5 font-bold text-emerald-400 bg-yellow-400/5">
                    ✓ ₹0 Forever (Zero Subscriptions)
                  </td>
                  <td className="p-5 text-neutral-400">Free but zero privacy safety</td>
                  <td className="p-5 text-neutral-400">₹999 to ₹2,500 upfront</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. 3D HARDWARE LAYER ARCHITECTURE (Exploded View)                     */}
      {/* ===================================================================== */}
      <section className="py-24 bg-[#060606] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
              / 05 HARDWARE COMPOSITION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineered layer-by-layer for extreme environmental endurance.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-sans">
              Explore the four high-durability layers that allow GuardianTag to withstand motorcycle crashes, highway speeds, and monsoon downpours.
            </p>
          </div>

          <ExplodedView3D />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. ZERO PII EXPOSURE & DATA DISINTEGRATION SIMULATOR                  */}
      {/* ===================================================================== */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
              / 06 PRIVACY DISINTEGRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Zero phone number leakage. Complete bystander anonymity.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-sans">
              Simulate what happens when an emergency call is placed. Your real SIM mobile number never touches the web browser.
            </p>
          </div>

          <PrivacyDisintegration />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. SPECTUP VERIFIED RIDER ENDORSEMENTS (Testimonials)                */}
      {/* ===================================================================== */}
      <section className="py-24 bg-[#060606] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
                / 07 VERIFIED ENDORSEMENTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                What Indian riders say about GuardianTag hardware.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-xl font-black text-white">4.9 / 5.0</div>
                <div className="text-[11px] text-neutral-400">184 Verified Reviews</div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VERIFIED_TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-neutral-950 border border-white/10 space-y-4 hover:border-yellow-400/40 transition-colors"
              >
                <div className="flex text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
                  <div>
                    <div className="text-xs font-bold text-white">{t.author}</div>
                    <div className="text-[11px] text-neutral-400">{t.role}</div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Rider
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. FREQUENTLY ASKED QUESTIONS SECTION                                 */}
      {/* ===================================================================== */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">
              / 08 FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Everything you need to know.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition"
                  >
                    <span className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed pl-11 border-t border-white/5 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. SPECTUP CLOSING MANDATE / HIGH-IMPACT FINAL CTA SECTION            */}
      {/* ===================================================================== */}
      <section className="py-28 bg-gradient-to-b from-[#0a0a0a] to-black relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-400/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-bold text-neutral-300">
            <span className="text-yellow-400">/ 09 SECURE YOUR TAG</span>
            <span className="text-neutral-500">•</span>
            <span className="tracking-widest uppercase">DISPATCH WITHIN 24 HOURS</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
            Secure your helmet. Protect your family on every kilometer.
          </h2>

          <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Order the GTB Biker Emergency Safety Kit today for ₹499 with free express delivery across India. Zero subscriptions forever.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-9 py-4.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-yellow-400/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Order Biker Kit — ₹499</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <a
              href="https://wa.me/918058800880?text=Hello%20GuardianTag!%20I%20want%20to%20order%20the%20GTB%20Biker%20Kit%20for%20%E2%82%B9499.%20Please%20share%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-mono font-bold text-sm border border-[#25D366]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>⚡ Order on WhatsApp in 30s</span>
            </a>

            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-neutral-300" />
              <span>Activate Existing Tag</span>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-500">
            <span>✓ 1-Year All-Weather Guarantee</span>
            <span>•</span>
            <span>✓ Shipped via Bluedart / Express Air</span>
            <span>•</span>
            <span>✓ 256-Bit SSL Encrypted Verification</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
