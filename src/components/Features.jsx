import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiLock, FiFilm, FiBookOpen, FiShield, FiZap } from 'react-icons/fi';

export default function Features() {
  const featureList = [
    {
      title: 'AI Video Safety Check',
      description: 'Every upload goes through a real-time AI safety moderate audit to scan visual nudity, combat violence, and vulgarity transcripts.',
      icon: <FiCpu className="h-6 w-6 text-coral" />,
      bgColor: 'bg-coral/10',
      borderColor: 'border-coral/20'
    },
    {
      title: 'Parent PIN Protection',
      description: 'Parent settings, custom tags filters, and screen time analytics are securely gated behind a 4-digit security PIN to prevent children overrides.',
      icon: <FiLock className="h-6 w-6 text-purple" />,
      bgColor: 'bg-purple/10',
      borderColor: 'border-purple/20'
    },
    {
      title: 'Safe Shorts Only',
      description: 'Native scrolling vertical Reels optimized for children, featuring cute likes animations, winking smiley reactions, and child-appropriate categories.',
      icon: <FiFilm className="h-6 w-6 text-pink" />,
      bgColor: 'bg-pink/10',
      borderColor: 'border-pink/20'
    },
    {
      title: 'Educational Content',
      description: 'Curated topics like science labs experiments, nursery rhymes, animals, painting guides, and life skills tutorials to help children learn safely.',
      icon: <FiBookOpen className="h-6 w-6 text-teal" />,
      bgColor: 'bg-teal/10',
      borderColor: 'border-teal/20'
    },
    {
      title: 'No Adult Content',
      description: 'Strict block filter policies against NSFW topics, drugs, gambling, and swearing. Safe score below 65% is immediately blocked from publishing.',
      icon: <FiShield className="h-6 w-6 text-yellow-600" />,
      bgColor: 'bg-yellow/10',
      borderColor: 'border-yellow/20'
    },
    {
      title: 'Fast & Secure',
      description: 'Lightweight APK builds optimized for both web browsers and low-spec Android devices, delivering smooth stream buffering.',
      icon: <FiZap className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue/10',
      borderColor: 'border-blue/20'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="features" className="relative py-20 dark:bg-slate-900/40">
      {/* Glow balls */}
      <div className="circle-bg top-40 right-10 h-[300px] w-[300px] bg-purple/10" />
      <div className="circle-bg bottom-10 left-10 h-[300px] w-[300px] bg-coral/10" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
            Why Parents Choose <span className="bg-gradient-to-r from-coral to-pink bg-clip-text text-transparent">Kids Aura</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            We combine artificial intelligence checks with strict family security controls to create the safest screen time environment for your child.
          </p>
        </div>

        {/* Feature grid */}
        <motion.div 
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {featureList.map((feat, idx) => (
            <motion.div
              key={idx}
              className={`glass-card flex flex-col gap-5 rounded-3xl border ${feat.borderColor} p-8 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 active:scale-[0.99] transition-all`}
              variants={cardVariants}
            >
              {/* Icon slot */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feat.bgColor}`}>
                {feat.icon}
              </div>
              
              <div>
                <h3 className="font-kids text-lg font-bold text-slate-800 dark:text-white">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
