'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeader, { CONTAINER_CLASS, SECTION_CLASS } from '@/components/ui/SectionHeader';

const faqs = [
  {
    question: 'How does GuardianTag work in an emergency?',
    answer:
      'Anyone who scans the QR on your helmet, keys or bike opens your emergency page in their phone browser. With one tap they can call your emergency contact or national helplines (112 and the 1033 highway helpline). They don’t need an app or an account.',
  },
  {
    question: 'Is there a monthly or yearly fee?',
    answer:
      'No. The Biker Kit is a one-time purchase of ₹499 for 4 stickers, 2 key rings, a PVC card and a pin badge. There is no subscription, and your emergency page stays online.',
  },
  {
    question: 'Can someone who scans the tag see my phone number?',
    answer:
      'No. Your phone number and address are never shown on the tag or the emergency page. Calls are connected through GuardianTag, so the person helping you reaches your contact without seeing anyone’s number.',
  },
  {
    question: 'How much is delivery, and how long does it take?',
    answer:
      'Delivery is free to all serviceable pin codes in India. Orders are packed within 24–48 hours and usually arrive in 3–5 business days by tracked courier.',
  },
  {
    question: 'What is the replacement policy?',
    answer:
      'If a tag arrives damaged, has a print defect or doesn’t scan, tell us within 7 days at support@guardiantag.in or on WhatsApp (+91 80588 00880) and we’ll replace it.',
  },
  {
    question: 'What if I lose a tag or sell my bike?',
    answer:
      'Log in on the Manage page with your tag ID and PIN (or an SMS code). You can pause the tag, change your emergency contacts, or ask us to reset it for the next owner.',
  },
  {
    question: 'Will the tags survive rain, sun and highway riding?',
    answer:
      'Yes. They are laminated, waterproof stickers with UV protection, made to handle monsoon rain, mud, sun and regular washing. Just peel and stick them on a clean, dry surface.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={SECTION_CLASS}>
      <div className={`${CONTAINER_CLASS} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16`}>
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-6">
          <SectionHeader
            align="left"
            eyebrow="FAQ"
            title="Questions, answered."
            intro="Can't find what you're looking for? We usually reply on WhatsApp within a few hours."
          />
          <Link
            href="https://wa.me/918058800880"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white hover:bg-white/15 transition"
          >
            Ask on WhatsApp
          </Link>
        </div>

        <div className="lg:col-span-8 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-6 cursor-pointer group"
                  >
                    <span className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      {faq.question}
                    </span>
                    <Plus
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-yellow-400' : 'text-neutral-500'
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-neutral-400 text-[15px] leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
