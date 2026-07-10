import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiSettings, FiKey, FiHeart } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Download Kids Aura',
      description: 'Get the installation package (.apk file) directly from this landing site by clicking the Download button.',
      icon: <FiDownload className="h-6 w-6 text-coral" />,
      color: 'border-coral',
      bgColor: 'bg-coral/10'
    },
    {
      step: '2',
      title: 'Install the App',
      description: 'Open the downloaded package on your Android device and allow permissions to trigger setup.',
      icon: <FiSettings className="h-6 w-6 text-purple" />,
      color: 'border-purple',
      bgColor: 'bg-purple/10'
    },
    {
      step: '3',
      title: 'Create Parent PIN',
      description: 'Launch the app and enter a secure 4-digit PIN lock. This passcode acts as your gate to all child safety controls.',
      icon: <FiKey className="h-6 w-6 text-teal" />,
      color: 'border-teal',
      bgColor: 'bg-teal/10'
    },
    {
      step: '4',
      title: 'Enjoy Safe Shorts',
      description: 'Allow your kid to scroll through short video categories safely. Everything is audited and parent-approved.',
      icon: <FiHeart className="h-6 w-6 text-pink" />,
      color: 'border-pink',
      bgColor: 'bg-pink/10'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-slate-100/40 dark:bg-slate-900/20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
            Quick Start <span className="bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">Timeline</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Follow these four simple steps to secure your children’s screen time in under two minutes.
          </p>
        </div>

        {/* Timeline body */}
        <div className="relative mt-20">
          {/* Connector Line (Desktop only) */}
          <div className="absolute top-[40px] left-[15%] right-[15%] hidden h-0.5 bg-gradient-to-r from-coral via-purple to-teal opacity-30 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                {/* Step Circle Badge */}
                <div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 ${step.color} bg-white shadow-lg dark:bg-slate-800`}>
                  {step.icon}
                  
                  {/* Floating index flag */}
                  <span className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-black text-white dark:bg-slate-200 dark:text-slate-950">
                    {step.step}
                  </span>
                </div>

                {/* Details card */}
                <div className="glass-card mt-6 rounded-2xl p-6 hover:scale-[1.02] transition-all">
                  <h3 className="font-kids text-lg font-bold text-slate-800 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
