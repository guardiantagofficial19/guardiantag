'use client';

import React, { useState } from 'react';
import { PhoneCall, MessageSquare, Shield, CheckCircle2, X } from 'lucide-react';
import { getOwnerByQrId } from '@/lib/tagService';
import { triggerMaskedCall, triggerEmergencySms } from '@/lib/twilioService';
import { INDIA_HELPLINES } from '@/lib/mockData';

export default function InteractiveScanSimulator() {
  const [selectedTag, setSelectedTag] = useState('GTB0001');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const owner = getOwnerByQrId(selectedTag);

  const handleCallOwner = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const res = await triggerMaskedCall(selectedTag);
    setIsLoading(false);
    setStatusMessage(res.message);
  };

  const handleSmsEmergency = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    const res = await triggerEmergencySms(selectedTag, { latitude: 12.9716, longitude: 77.5946 });
    setIsLoading(false);
    setStatusMessage(res.message);
  };

  return (
    <section id="simulator" className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-extrabold uppercase tracking-wider">
            Live Interactive Simulator
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Experience the Emergency Scan Screen
          </h2>
          <p className="text-slate-600 text-base font-medium">
            This is exactly what a bystander or responder sees when scanning your tag. Zero app download, 100% privacy protected.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls / Tag Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#064E3B]" />
                Select Demo Tag Format
              </h3>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setSelectedTag('GTB0001')}
                  className={`p-4 rounded-2xl text-left border font-bold text-xs flex justify-between items-center transition ${
                    selectedTag === 'GTB0001'
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className={selectedTag === 'GTB0001' ? 'text-emerald-300 font-extrabold' : 'text-slate-900 font-bold'}>GTB0001</span> — Biker Tag
                    <p className={`text-[10px] font-normal mt-0.5 ${selectedTag === 'GTB0001' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      Owner: Vikramaditya S. (Himalayan Bike)
                    </p>
                  </div>
                  {selectedTag === 'GTB0001' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                </button>

                <button
                  onClick={() => setSelectedTag('GTT0001')}
                  className={`p-4 rounded-2xl text-left border font-bold text-xs flex justify-between items-center transition ${
                    selectedTag === 'GTT0001'
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className={selectedTag === 'GTT0001' ? 'text-emerald-300 font-extrabold' : 'text-slate-900 font-bold'}>GTT0001</span> — Traveller Tag
                    <p className={`text-[10px] font-normal mt-0.5 ${selectedTag === 'GTT0001' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      Owner: Aarav P. (Delhi-Mumbai Flight)
                    </p>
                  </div>
                  {selectedTag === 'GTT0001' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                </button>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 text-xs text-slate-700 space-y-2 font-medium">
                <div className="flex items-center gap-1.5 font-bold text-[#064E3B]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Privacy Verification Passed</span>
                </div>
                <p>
                  Notice that neither the owner&apos;s real phone number nor private address is exposed in the DOM. Call routing is 100% anonymized.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Phone Interface Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-sm bg-slate-900 rounded-[44px] p-4 border-4 border-slate-800 shadow-2xl relative">
              {/* Phone Notch */}
              <div className="w-32 h-4 bg-slate-950 mx-auto rounded-full mb-3 flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-900 rounded-full" />
              </div>

              {/* Public Emergency Page Mock Body */}
              <div className="bg-white rounded-[32px] p-5 text-slate-900 text-center space-y-5 shadow-inner">
                
                {/* Header Badge */}
                <div className="bg-[#064E3B] text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-extrabold tracking-wider uppercase">
                    EMERGENCY SAFETY TAG
                  </span>
                </div>

                {/* QR ID Display ONLY */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">
                    TAG ID REFERENCE
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-wider">
                    {selectedTag}
                  </span>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">
                    No Personal Data Disclosed • Public Scanner View
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-1">
                  <button
                    onClick={handleCallOwner}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#04392a] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-300" />
                    <span>Connect to Owner (Masked Call)</span>
                  </button>

                  <button
                    onClick={handleSmsEmergency}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FF4D4D] hover:bg-[#e03a3a] text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Send Emergency SMS + GPS Location</span>
                  </button>
                </div>

                {/* Status Output Modal/Toast inside simulator */}
                {statusMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-slate-800 text-left relative">
                    <button onClick={() => setStatusMessage(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <p className="font-bold text-[#064E3B] mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Telephony Relay Output:
                    </p>
                    <p className="leading-snug text-slate-900 font-mono text-[10px]">{statusMessage}</p>
                  </div>
                )}

                {/* India Helplines Bar inside simulator */}
                <div className="pt-3 border-t border-slate-100 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                    🇮🇳 National Emergency Helplines
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {INDIA_HELPLINES.slice(0, 4).map((h, i) => (
                      <a
                        key={i}
                        href={`tel:${h.number.split('/')[0].trim()}`}
                        className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 text-[10px] flex items-center justify-between font-bold text-slate-800 transition"
                      >
                        <span>{h.name}</span>
                        <span className="text-[#064E3B] font-mono">{h.number}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

