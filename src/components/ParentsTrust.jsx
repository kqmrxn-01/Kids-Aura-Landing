import React from 'react';
import { motion } from 'framer-motion';
import { FiXOctagon, FiCpu, FiUsers, FiAward, FiLock } from 'react-icons/fi';

export default function ParentsTrust() {
  const trustReasons = [
    {
      title: 'No 18+ Videos',
      description: 'Zero tolerance for mature content. Standard uploads containing fights, profanity, or adult situations are immediately blocked at the gateway.',
      icon: <FiXOctagon className="h-6 w-6 text-coral" />,
      color: 'border-coral/20',
      bgColor: 'bg-coral/5'
    },
    {
      title: 'AI Moderation Engine',
      description: 'Built-in scans check frame sequences and transcribe speech, keeping the platform clean without requiring parental monitoring.',
      icon: <FiCpu className="h-6 w-6 text-purple" />,
      color: 'border-purple/20',
      bgColor: 'bg-purple/5'
    },
    {
      title: 'Safe Kids Community',
      description: 'Encourages positive engagement. Bullying or inappropriate comments are reported and automatically flagged.',
      icon: <FiUsers className="h-6 w-6 text-teal" />,
      color: 'border-teal/20',
      bgColor: 'bg-teal/5'
    },
    {
      title: 'Educational Entertainment',
      description: 'Pre-seeded loops focus on animal sciences, school lab volcanos, watercolors, and positive habits to mix fun with learning.',
      icon: <FiAward className="h-6 w-6 text-yellow-600" />,
      color: 'border-yellow/20',
      bgColor: 'bg-yellow/5'
    },
    {
      title: 'Privacy Focused',
      description: 'Strict compliance with child privacy laws (COPPA/GDPR). We do not collect personalized data or profile kids for ads.',
      icon: <FiLock className="h-6 w-6 text-pink" />,
      color: 'border-pink/20',
      bgColor: 'bg-pink/5'
    }
  ];

  return (
    <section id="trust" className="relative py-20 bg-slate-100/40 dark:bg-slate-900/20">
      <div className="circle-bg top-0 left-20 h-[250px] w-[250px] bg-teal/10" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
            Why Parents Trust <span className="bg-gradient-to-r from-coral via-purple to-pink bg-clip-text text-transparent">Kids Aura</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            We put child safety and parental peace of mind at the core of our development, creating a safe digital playground.
          </p>
        </div>

        {/* Staggered Grid */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {trustReasons.map((reason, idx) => (
            <motion.div
              key={idx}
              className={`glass-card flex max-w-[340px] flex-col gap-4 rounded-3xl border ${reason.color} p-6 shadow-sm hover:scale-[1.03] transition-all`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {/* Badge Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${reason.bgColor}`}>
                {reason.icon}
              </div>

              <div>
                <h3 className="font-kids text-lg font-bold text-slate-800 dark:text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
