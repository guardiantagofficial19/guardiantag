'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import HardwareCard from '@/components/ui/HardwareCard';
import Badge from '@/components/ui/Badge';
import AdminGatekeeper from '@/components/AdminGatekeeper';
import { Bus, ShieldCheck, CheckCircle2, QrCode, Download, RefreshCw, Layers } from 'lucide-react';

export default function FleetAdminPage() {
  const [selectedFleet, setSelectedFleet] = useState<'DELHI_SCHOOL' | 'BANGALORE_BIKER_CLUB' | 'CORPORATE_ASSETS'>('DELHI_SCHOOL');

  const fleets = [
    {
      id: 'DELHI_SCHOOL' as const,
      name: 'Delhi Public School Fleet #401',
      totalTags: 250,
      activeTags: 242,
      stolenCount: 0,
      tagType: 'GTK (Kids Tag)',
      icon: Bus,
    },
    {
      id: 'BANGALORE_BIKER_CLUB' as const,
      name: 'Bengaluru Biker Club Syndicate',
      totalTags: 180,
      activeTags: 175,
      stolenCount: 1,
      tagType: 'GTB (Biker Tag)',
      icon: Layers,
    },
    {
      id: 'CORPORATE_ASSETS' as const,
      name: 'TechPark Corporate Asset Decals',
      totalTags: 500,
      activeTags: 490,
      stolenCount: 0,
      tagType: 'GTU (Universal Decal)',
      icon: ShieldCheck,
    },
  ];

  const currentFleet = fleets.find((f) => f.id === selectedFleet) || fleets[0];

  return (
    <AdminGatekeeper>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div className="space-y-1">
              <span className="px-3.5 py-1 rounded-full bg-white/10 text-white border border-white/20 font-mono font-bold text-xs uppercase">
                B2B FLEET &amp; BATCH MANAGEMENT
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Commercial Fleet Telemetry.
              </h1>
            </div>

            <Button href="/admin/qr-generator" icon={<QrCode className="w-4 h-4" />}>
              Provision New Fleet Batch
            </Button>
          </div>

          {/* Fleet Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fleets.map((f) => {
              const isSelected = selectedFleet === f.id;
              const Icon = f.icon;
              return (
                <HardwareCard
                  key={f.id}
                  hoverLift={false}
                  onClick={() => setSelectedFleet(f.id)}
                  className={`p-6 space-y-3 cursor-pointer transition ${
                    isSelected ? 'border-2 border-white bg-white/10 shadow-2xl' : 'border border-white/15 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-6 h-6 text-white" />
                    <Badge variant="subtle">{f.tagType}</Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-white">{f.name}</h3>
                  <div className="flex justify-between text-xs font-mono text-neutral-400 border-t border-white/10 pt-2">
                    <span>Active: {f.activeTags}/{f.totalTags}</span>
                    <span className="text-white font-bold">{f.stolenCount > 0 ? `🚨 ${f.stolenCount} Alert` : 'All Clear'}</span>
                  </div>
                </HardwareCard>
              );
            })}
          </div>

          {/* Fleet Batch Detail Board */}
          <HardwareCard hoverLift={false} className="border-2 border-white/20 p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{currentFleet.name}</h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Batch Tag Type: {currentFleet.tagType} • Server Session Authenticated
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(`Exporting CSV Manifest for ${currentFleet.name}...`)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs border border-white/20 flex items-center gap-2 cursor-pointer transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Batch Manifest (CSV)</span>
                </button>
              </div>
            </div>

            {/* Fleet Telemetry Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">TOTAL PROVISIONED TAGS</span>
                <span className="text-3xl font-extrabold text-white">{currentFleet.totalTags}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">ACTIVATED BY DRIVERS / PARENTS</span>
                <span className="text-3xl font-extrabold text-emerald-400">{currentFleet.activeTags}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block">SECURITY STOLEN ALERTS</span>
                <span className="text-3xl font-extrabold text-red-400">{currentFleet.stolenCount}</span>
              </div>
            </div>

          </HardwareCard>

        </main>

        <Footer />
      </div>
    </AdminGatekeeper>
  );
}
