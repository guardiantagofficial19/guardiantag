import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | GuardianTag',
  description: 'GuardianTag Privacy Policy in accordance with India’s Digital Personal Data Protection (DPDP) Act 2023.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-white/15 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            DPDP ACT 2023 COMPLIANT
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-neutral-400 text-sm font-mono">
            Last Updated: October 14, 2026 · GuardianTag
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <EyeOff className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Your Number Stays Hidden</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We never print your phone number on tags or display it publicly to bystanders.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Zero Tracking</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tags have no GPS chip, Bluetooth, or battery. We do not track your location.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Trash2 className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Right to Delete</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Deactivate your tag or delete your data anytime directly from your dashboard.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">1. Introduction</h2>
            <p>
              GuardianTag (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your personal privacy. This Privacy Policy details how we handle information in connection with our physical QR safety tags, website (<a href="https://guardiantag.in" className="text-white underline">guardiantag.in</a>), and emergency relay services, complying with the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;) of India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">2. What Information We Collect</h2>
            <p>We believe in strict data minimization. We only collect data necessary to enable emergency contact during an accident or lost-item incident:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-300">
              <li><strong>Owner Contact:</strong> Mobile number used during tag activation.</li>
              <li><strong>Emergency Contact (ICE):</strong> One designated emergency phone number and optional contact name/relation.</li>
              <li><strong>Vehicle / Gear Identifier:</strong> Optional motorcycle model or registration number you voluntarily register to confirm ownership.</li>
              <li><strong>Tag Serial:</strong> The alphanumeric hardware identifier (e.g., GTB0001).</li>
            </ul>
            <p className="text-sm text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/20 p-3.5 rounded-xl">
              <strong>What We Do NOT Collect:</strong> We never collect Aadhaar numbers, PAN cards, biometric data, financial accounts, or continuous GPS tracking history.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">3. How Your Data is Used & Protected</h2>
            <p>
              When a bystander or first responder scans your physical QR tag, they do not see your private phone number. Our server verifies the tag status and provides masked call relay options.
            </p>
            <p>
              All data is stored in secured databases with encryption in transit (TLS 1.3) and encryption at rest. Access is strictly controlled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">4. Your Rights Under DPDP Act 2023</h2>
            <p>As a data principal, you have full control over your information:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-300">
              <li><strong>Right to Access:</strong> View all data tied to your tags anytime at <Link href="/manage" className="text-white underline">guardiantag.in/manage</Link>.</li>
              <li><strong>Right to Correction:</strong> Update your emergency numbers or vehicle details instantly in your dashboard.</li>
              <li><strong>Right to Erasure / Deactivation:</strong> You can mark your tag as deactivated or request permanent erasure of your account by writing to <a href="mailto:support@guardiantag.in" className="text-white underline">support@guardiantag.in</a>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">5. Contact Our Privacy Team</h2>
            <p>
              If you have any questions or data requests, contact us:
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs sm:text-sm space-y-1 text-neutral-300">
              <p><strong className="text-white">Email:</strong> support@guardiantag.in</p>
              <p><strong className="text-white">WhatsApp:</strong> +91 80588 00880</p>
              <p><strong className="text-white">Entity:</strong> GuardianTag</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
