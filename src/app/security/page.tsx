import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, PhoneCall, Server, KeyRound, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Security Protocol | GuardianTag',
  description: 'GuardianTag Security Architecture, Number Masking, and Zero-PII Protections.',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-white/15 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ZERO-PII SECURITY ARCHITECTURE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Security Protocol
          </h1>
          <p className="text-neutral-400 text-sm font-mono">
            How GuardianTag protects riders and personal identities.
          </p>
        </div>

        {/* Security Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Masked Phone Proxy</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Bystanders never see your personal phone number. Calls route through secure masked voice relays.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Encrypted Backend</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Data is stored in isolated PostgreSQL clusters with TLS 1.3 encryption in transit and AES encryption at rest.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">PIN &amp; Lost Tag Control</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Owner-controlled dashboard allows instant tag deactivation if gear or motorcycle is lost.
            </p>
          </div>
        </div>

        {/* Technical Explanations */}
        <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">1. Zero Public PII Guarantee</h2>
            <p>
              Traditional luggage tags and bike stickers write the owner&apos;s phone number, name, and home address in plain text on the product. Anyone walking past in a parking lot or fuel station can photograph your personal contact info.
            </p>
            <p>
              GuardianTag eliminates this risk. Only an anonymous alphanumeric ID (e.g. <code>GTB0001</code>) and an optical QR pattern appear on the hardware. Scanners access an emergency interface that conceals your real 10-digit number.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">2. Rate Limiting & Abuse Prevention</h2>
            <p>
              To protect owners from spam or harassment, the emergency contact endpoint employs intelligent rate limiting:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-300">
              <li>Scanners must input their own 10-digit Indian mobile number to trigger an automated connection.</li>
              <li>Calls are rate-limited to prevent automated robocalling abuse.</li>
              <li>Suspicious patterns automatically prompt callers to use direct national helplines (112 / 108).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">3. Lost Tag Protocol & Instant Deactivation</h2>
            <p>
              If you lose a helmet, sell your bike, or misplace a keychain tag, you can deactivate it immediately:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-neutral-300">
              <li>Log in to your dashboard at <Link href="/manage" className="text-white underline">guardiantag.in/manage</Link> using your registered phone number.</li>
              <li>Locate your tag ID and toggle its status to &ldquo;Deactivated&rdquo;.</li>
              <li>Once deactivated, scanning the tag will no longer trigger phone relays to your emergency contact.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">4. Reporting Vulnerabilities</h2>
            <p>
              We take security seriously. If you identify a potential security vulnerability, please disclose it responsibly to <a href="mailto:support@guardiantag.in" className="text-white underline">support@guardiantag.in</a>. We respond to all security inquiries within 24 hours.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
