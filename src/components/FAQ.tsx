'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does GuardianTag work in an emergency?',
      answer: 'When a bystander or paramedic scans your physical GuardianTag QR on your helmet, keychain, or motorcycle, it opens a fast mobile emergency page. With a single tap, they can call your primary emergency contact directly or connect to national emergency services (112 & 1033). No app download or sign-up is required.',
    },
    {
      question: 'Is there any yearly or monthly subscription fee?',
      answer: 'No. GuardianTag is a one-time purchase of ₹499 for the complete 4-piece Biker Safety Kit. There are zero monthly or yearly subscription fees. Lifetime emergency page hosting and QR connectivity are included.',
    },
    {
      question: 'Is my private phone number or personal identity exposed to anyone who scans?',
      answer: 'Never. We do not display your private phone number or home address publicly on the emergency page. Bystanders reach your designated emergency contact without seeing your personal contact number.',
    },
    {
      question: 'What are the delivery charges and shipping times across India?',
      answer: 'We provide free shipping across all serviceable pin codes in India. Orders are processed within 24-48 hours and delivered via tracked express couriers within 3 to 5 business days.',
    },
    {
      question: 'What is your replacement policy?',
      answer: 'We offer a 7-day replacement guarantee. If your tag arrives damaged, has a print defect, or fails to scan, reach out to support@guardiantag.in or WhatsApp support at +91 80588 00880 for a quick, no-hassle replacement.',
    },
    {
      question: 'What happens if I lose my tag or sell my bike? Can I deactivate it?',
      answer: 'Yes! You have full owner control. Simply log into your GuardianTag Dashboard at /manage using your registered phone number to deactivate your tag instantly or update your emergency contact info anytime.',
    },
    {
      question: 'How durable are the tags in Indian weather and high-speed riding?',
      answer: 'Tags are crafted from heavy-duty impact PVC and laminated vinyl with UV protection and all-weather 3M adhesive. They are 100% waterproof, mud-resistant, and tested against highway wind and frequent washing.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-black text-white border-b border-white/15 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Everything you need to know.
          </h2>
        </div>

        {/* Sequential Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="hardware-card rounded-2xl overflow-hidden border border-white/15"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition"
                >
                  <span className="text-base sm:text-lg font-extrabold text-white font-sans">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-neutral-400 text-sm font-normal leading-relaxed border-t border-white/10 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
