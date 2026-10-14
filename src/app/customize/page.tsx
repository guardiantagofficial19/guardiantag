'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import { Sliders, Shield, ArrowRight, Check, Sparkles, QrCode, Lock } from 'lucide-react';

function CustomizerContent() {
  const searchParams = useSearchParams();
  const initialModelParam = (searchParams.get('model') || 'GTB').toUpperCase();
  const initialModel = ['GTK', 'GTT', 'GTU'].includes(initialModelParam) ? 'GTB' : initialModelParam;

  const [model, setModel] = useState<'GTB' | 'GTK' | 'GTT' | 'GTU'>(
    ['GTB', 'GTK', 'GTT', 'GTU'].includes(initialModel) ? (initialModel as any) : 'GTB'
  );

  const [finish, setFinish] = useState<'STEALTH' | 'SILVER' | 'REFLECTIVE'>('STEALTH');
  const [customHeader, setCustomHeader] = useState('IN CASE OF EMERGENCY');
  const [ownerLabel, setOwnerLabel] = useState('GT-OWNER-4892');
  const [emergencyPhoneNote, setEmergencyPhoneNote] = useState('+91 98765 43210');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const modelPrices: Record<string, { price: number; name: string; desc: string; isComingSoon: boolean }> = {
    GTB: { price: 499, name: 'GTB Biker Tag Kit', desc: '1 PVC Tag + 1 Key Chain + Small & Large Stickers', isComingSoon: false },
    GTK: { price: 399, name: 'GTK Kids Tag', desc: 'Backpack & Child Safety', isComingSoon: true },
    GTT: { price: 449, name: 'GTT Traveller Tag', desc: 'Luggage & Global Travel', isComingSoon: true },
    GTU: { price: 299, name: 'GTU Universal Decal', desc: 'Multi-Surface Decal', isComingSoon: true },
  };

  const currentProduct = modelPrices[model];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 sm:pt-36 pb-16 bg-black text-white border-b border-white/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase">
            <Sliders className="w-4 h-4" />
            <span>INTERACTIVE HARDWARE TAG CUSTOMIZER</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Personalize Your GuardianTag.
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Choose your model, custom printed header text, surface finish, and preview your custom safety tag in real-time.
          </p>
        </div>
      </section>

      {/* Main Customizer Workspace */}
      <section className="py-20 bg-black text-white border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Interactive Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Model Selection */}
              <div className="hardware-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/15">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-xs">1</span>
                    SELECT TAG MODEL
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Selected: {model}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(['GTB', 'GTK', 'GTT', 'GTU'] as const).map((m) => {
                    const item = modelPrices[m];
                    const disabled = item.isComingSoon;
                    return (
                      <button
                        key={m}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setModel(m)}
                        className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                          disabled
                            ? 'bg-neutral-950/50 text-neutral-500 border-white/10 opacity-70 cursor-not-allowed'
                            : model === m
                            ? 'bg-white text-black border-white shadow-xl cursor-pointer'
                            : 'bg-black text-white border-white/20 hover:border-white/40 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-extrabold font-mono">{m}</span>
                          {disabled ? (
                            <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              COMING SOON
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              AVAILABLE NOW
                            </span>
                          )}
                        </div>
                        <span className="text-xs mt-2 opacity-80 font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Surface Finish Selection */}
              <div className="hardware-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/15">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-xs">2</span>
                    SELECT SURFACE FINISH
                  </span>
                  <span className="text-xs font-mono text-neutral-400">{finish}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'STEALTH', name: 'Stealth Black', detail: 'Matte Non-Reflective' },
                    { id: 'SILVER', name: 'Tactical Silver', detail: 'Anodized Chrome Finish' },
                    { id: 'REFLECTIVE', name: 'High-Vis Reflective', detail: 'Headlight Reflective' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFinish(f.id as any)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        finish === f.id
                          ? 'bg-white text-black border-white shadow-xl font-bold'
                          : 'bg-black text-white border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className="text-xs font-extrabold font-mono block">{f.name}</span>
                      <span className="text-[10px] opacity-75 font-normal block mt-1">{f.detail}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Custom Text Etching */}
              <div className="hardware-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/15">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-xs">3</span>
                    CUSTOM LASER ETCHING
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Live Preview</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      TAG HEADER TEXT (Top Etching)
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={customHeader}
                      onChange={(e) => setCustomHeader(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                      placeholder="e.g. IN CASE OF EMERGENCY"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      OWNER LABEL / NAME
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={ownerLabel}
                      onChange={(e) => setOwnerLabel(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                      placeholder="e.g. RIDER: AJAY M."
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">
                      EMERGENCY CONTACT PRE-FILL (Masked)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={emergencyPhoneNote}
                      onChange={(e) => setEmergencyPhoneNote(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Real-Time Hardware Plate Preview & Checkout Box (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-28">
              
              {/* Hardware Preview Card */}
              <div className="hardware-card p-8 rounded-3xl border border-white/20 shadow-2xl relative space-y-6 text-center">
                
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    LIVE PREVIEW
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-black">
                    {model} • {finish}
                  </span>
                </div>

                {/* Hardware Physical Plate Preview Graphic */}
                <div className="py-2 flex justify-center">
                  <PhysicalTag3D size="lg" tagType={model} serial={ownerLabel || `${model}-4892`} />
                </div>

                {/* Order Summary & Pricing */}
                <div className="pt-4 border-t border-white/15 space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-400">Customized Tag ({model}):</span>
                    <span className="text-white font-bold">₹{currentProduct.price}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-400">Laser Etching:</span>
                    <span className="text-white font-bold">FREE</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-400">Shipping (India):</span>
                    <span className="text-white font-bold">FREE</span>
                  </div>

                  <div className="flex justify-between items-center text-base font-mono font-extrabold pt-2 border-t border-white/15">
                    <span>Total Amount:</span>
                    <span className="text-white">₹{currentProduct.price}</span>
                  </div>
                </div>

                {/* Order CTA Button */}
                {orderSuccess ? (
                  <div className="p-4 rounded-2xl bg-white text-black font-extrabold text-xs text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>CUSTOM TAG ORDER CREATED!</span>
                    </div>
                    <p className="text-[10px] font-normal font-mono opacity-80">
                      Your tag configuration has been saved. Proceeding to delivery details...
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setOrderSuccess(true)}
                    className="w-full py-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Order Customized Tag (₹{currentProduct.price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Includes 1-Year Hardware Safety Warranty</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CustomizerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading customizer...</div>}>
      <CustomizerContent />
    </Suspense>
  );
}
