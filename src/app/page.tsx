'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ExplodedView3D from '@/components/cinematic/ExplodedView3D';
import EmergencyDemo from '@/components/EmergencyDemo';
import BikerTagShowcase from '@/components/cinematic/BikerTagShowcase';
import GuardianSafetyFeatures from '@/components/GuardianSafetyFeatures';
import PrivacySection from '@/components/PrivacySection';
import TrustSection from '@/components/TrustSection';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

// Cinematic Interactive Enhancers
import CinematicIntro from '@/components/cinematic/CinematicIntro';
import LightingEngine from '@/components/cinematic/LightingEngine';

import { SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

// Structured data so search engines can show the product, price and brand.
const PRODUCT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'GuardianTag Biker Emergency QR Tag Kit',
  brand: { '@type': 'Brand', name: 'GuardianTag' },
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/gt-logo.png`,
  url: `${SITE_URL}/products`,
  offers: {
    '@type': 'Offer',
    price: '499',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/products`,
  },
};

export default function Home() {
  return (
    // reducedMotion="user": framer-motion animations respect the OS "reduce motion" setting.
    <MotionConfig reducedMotion="user">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD).replace(/</g, '\\u003c') }}
    />
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* 0. Cinematic Intro Modal */}
      <CinematicIntro />

      {/* 0.2 Dynamic Ambient Rim Lighting Engine */}
      <LightingEngine />

      {/* Header Navigation */}
      <Navbar />

      {/* BLOCK 1: Hero */}
      <Hero />

      {/* BLOCK 1.2: GuardianTag Rider Safety & Feature Architecture */}
      <GuardianSafetyFeatures />

      {/* BLOCK 1.5: Interactive 3D Orbital Biker Tag Showcase */}
      <BikerTagShowcase />

      {/* BLOCK 2: How It Works & Live Emergency Connection Demo */}
      <HowItWorks />
      <EmergencyDemo />

      {/* BLOCK 3: 3D Hardware Layer Architecture (Exploded View) */}
      <ExplodedView3D />

      {/* BLOCK 4: Zero PII Exposure & Data Disintegration */}
      <PrivacySection />

      {/* BLOCK 5: Trust Pillars & FAQ Accordion */}
      <TrustSection />
      <FAQ />

      {/* BLOCK 6: Final CTA & Footer */}
      <FinalCTA />
      <Footer />
    </div>
    </MotionConfig>
  );
}
