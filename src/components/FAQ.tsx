'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does GuardianTag work if I am in an accident?',
      answer: 'When a bystander or first responder scans the physical QR tag on your helmet, bag, or vehicle using their smartphone camera, they are taken to a web page with single-tap emergency contact buttons. Your designated emergency contacts receive immediate alerts without revealing your real phone number on the web.',
    },
    {
      question: 'Does GuardianTag require a monthly subscription fee?',
      answer: 'No! GuardianTag operates as a physical hardware purchase with lifetime emergency web scanning included. Zero monthly subscriptions.',
    },
    {
      question: 'Do bystanders need to download an app to scan my tag?',
      answer: 'No app download is required. Standard iOS and Android camera apps automatically scan the optical QR pattern and open the mobile web emergency interface instantly.',
    },
    {
      question: 'Is my personal phone number visible to anyone who scans?',
      answer: 'No. GuardianTag uses server-side masked proxy call relays. Bystanders can call your emergency contact via the proxy line without seeing your private 10-digit number.',
    },
    {
      question: 'How durable is the GuardianTag hardware sticker/tag?',
      answer: 'GuardianTag hardware is crafted from high-impact polycarbonate with high-visibility reflective cores and industrial 3M heavy-duty waterproof adhesive. Designed to withstand rain, UV exposure, and speeds up to 150 km/h on motorcycles.',
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
