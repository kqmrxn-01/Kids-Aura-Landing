import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'Is Kids Aura really safe for my children?',
      answer: 'Yes! Kids Aura filters out all adult elements, violence, swearing, and unsafe content using real-time AI scanning. Parents can also restrict categories (like Gaming) and add custom blocked keywords.'
    },
    {
      question: 'How does the AI Content Moderation scanner work?',
      answer: 'When a video is uploaded, our safety scanner performs visual frame inspections to screen graphics and triggers speech-to-text checks to flag profanity. The video is only published to the feed if the Safe Score is 65% or higher.'
    },
    {
      question: 'Can children change the safety settings?',
      answer: 'No. The Parent Controls panel is locked behind a 4-digit PIN. Additionally, active sessions automatically time out and lock after 5 minutes of inactivity.'
    },
    {
      question: 'Does the application track my child’s search history?',
      answer: 'We do not collect personalized data or profile children for ads. Any category tracking is stored locally on the device to provide parents with usage stats.'
    },
    {
      question: 'Are there any ads or hidden fees inside the application?',
      answer: 'Kids Aura is 100% ad-free and free to download. We aim to keep screen time educational, clean, and distraction-free.'
    }
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
            Frequently Asked <span className="bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Have questions about Kids Aura safety and setup? Find the answers here.
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="mt-16 flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="glass-card overflow-hidden rounded-2xl border border-slate-200/50 transition-all dark:border-slate-800/40"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => handleToggle(idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="flex items-center gap-3 text-base font-bold text-slate-800 dark:text-white">
                    <FiHelpCircle className="text-coral shrink-0" /> {faq.question}
                  </span>
                  <span className="text-slate-500">
                    {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </span>
                </button>

                {/* Animated Answer panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-200/50 bg-slate-50/40 p-6 text-sm leading-relaxed text-slate-600 dark:border-slate-800/40 dark:bg-slate-800/20 dark:text-slate-300">
                        {faq.answer}
                      </div>
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
