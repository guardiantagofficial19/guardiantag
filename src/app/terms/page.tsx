import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | GuardianTag',
  description: 'GuardianTag Terms of Service, Shipping, Delivery, and Replacement Policy.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-white/15 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            TERMS &amp; POLICIES
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-neutral-400 text-sm font-mono">
            Last Updated: October 14, 2026 · GuardianTag
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Truck className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Pan-India Delivery</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              3 to 5 business days delivery across all serviceable pin codes in India with free shipping.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <RefreshCw className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">7-Day Replacement</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Immediate replacement for damaged, defective, or misprinted tags upon delivery.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Zero Subscription</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              One-time purchase of ₹499 for the Biker Kit. No annual fees or hidden renewals.
            </p>
          </div>
        </div>

        {/* Detailed Terms */}
        <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By purchasing, activating, or scanning a GuardianTag physical safety product, you agree to be bound by these Terms of Service. If you do not agree, please do not use our products or services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">2. Shipping & Delivery Policy</h2>
            <p>
              We dispatch orders across India through trusted courier partners (such as Delhivery, Blue Dart, DTDC, and India Post).
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-300">
              <li><strong>Processing Time:</strong> Orders are processed and printed within 24 to 48 hours of order confirmation.</li>
              <li><strong>Estimated Delivery:</strong> Typically 3 to 5 business days depending on delivery location in India.</li>
              <li><strong>Shipping Charges:</strong> Standard shipping is free on all GuardianTag Biker Kit purchases.</li>
              <li><strong>Tracking:</strong> Tracking details will be shared via SMS / WhatsApp once your package is dispatched.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">3. Replacement & Return Policy</h2>
            <p>
              We stand by our product quality. We offer a <strong>7-Day Replacement Guarantee</strong> from the date of delivery:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-300">
              <li>If your tag arrives damaged, bent, has print issues, or fails to scan, notify us within 7 days.</li>
              <li>Contact support via email at <a href="mailto:support@guardiantag.in" className="text-white underline">support@guardiantag.in</a> or WhatsApp at <strong className="text-white">+91 80588 00880</strong> with your order number and photos of the tag.</li>
              <li>We will ship a replacement tag kit free of charge.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">4. Emergency Service & Liability Disclaimer</h2>
            <p>
              GuardianTag is a passive QR identification tool intended to facilitate communication between bystanders and your designated emergency contacts during accidents or emergencies.
            </p>
            <p>
              GuardianTag does not guarantee immediate response by third parties and does not substitute for calling official emergency authorities. In life-threatening emergencies, bystanders must dial <strong>112</strong> (National Emergency) or <strong>108</strong> (Ambulance).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">5. Business Information</h2>
            <p>
              For legal inquiries, enterprise orders, or customer support:
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs sm:text-sm space-y-1 text-neutral-300">
              <p><strong className="text-white">Business Name:</strong> GuardianTag</p>
              <p><strong className="text-white">Website:</strong> https://guardiantag.in</p>
              <p><strong className="text-white">Support Email:</strong> support@guardiantag.in</p>
              <p><strong className="text-white">Support WhatsApp:</strong> +91 80588 00880</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
