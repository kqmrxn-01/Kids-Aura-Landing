import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiInfo, FiShield } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background Bubbly Shapes */}
      <div className="circle-bg top-20 left-[-10%] h-[350px] w-[350px] bg-pink/20" />
      <div className="circle-bg bottom-0 right-[-10%] h-[400px] w-[400px] bg-teal/20" />
      <div className="circle-bg top-40 right-[20%] h-[200px] w-[200px] bg-yellow/15" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Pitch Panel */}
          <motion.div 
            className="text-center lg:col-span-7 lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Soft Trust Pill badge */}
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-4 py-1.5 text-xs font-bold text-teal-600 dark:border-teal/30 dark:bg-teal/20 dark:text-teal-300"
              variants={itemVariants}
            >
              <FiShield /> 100% Certified Safe Kids App
            </motion.div>

            {/* Redesigned SVG Logo in Hero */}
            <motion.div className="mt-6 flex justify-center lg:justify-start" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 100 100" className="h-12 w-12 drop-shadow-lg">
                  <defs>
                    <linearGradient id="heroAuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff85a2" />
                      <stop offset="50%" stopColor="#ff6b6b" />
                      <stop offset="100%" stopColor="#ffe66d" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="url(#heroAuraGrad)" />
                  <circle cx="50" cy="50" r="32" fill="#4ecdc4" />
                  <circle cx="38" cy="45" r="4" fill="#1a1a24" />
                  <circle cx="62" cy="45" r="4" fill="#1a1a24" />
                  <path d="M 38,58 Q 50,70 62,58" fill="none" stroke="#1a1a24" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                  Kids<span className="bg-gradient-to-r from-coral to-pink bg-clip-text text-transparent"> Aura</span>
                </span>
              </div>
            </motion.div>

            <motion.h1 
              className="font-kids mt-6 text-4xl font-extrabold leading-[1.1] text-slate-800 dark:text-white md:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              The Safe Short Video App <br />
              <span className="bg-gradient-to-r from-coral via-purple to-teal bg-clip-text text-transparent">for Kids</span>
            </motion.h1>

            <motion.p 
              className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl"
              variants={itemVariants}
            >
              Our automated AI-powered safety scanning moderates sexual themes, violence, and vulgar language, giving parents total lock control and peace of mind.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              variants={itemVariants}
            >
              <a 
                href="#download"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral to-pink px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-coral/30 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <FiDownload size={18} /> Download APK
              </a>
              <a 
                href="#features"
                className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/50 px-8 py-4 text-base font-extrabold text-slate-700 backdrop-blur hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FiInfo size={18} /> Learn More
              </a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 lg:justify-start"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <span className="font-kids text-lg font-bold text-coral">✓</span> AI Scanner Scanned
              </div>
              <div className="flex items-center gap-2">
                <span className="font-kids text-lg font-bold text-purple">✓</span> No Ads/Adult content
              </div>
              <div className="flex items-center gap-2">
                <span className="font-kids text-lg font-bold text-teal">✓</span> COPPA Child Safe
              </div>
            </motion.div>
          </motion.div>

          {/* Graphical Display Column */}
          <motion.div 
            className="relative lg:col-span-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3 } }}
          >
            {/* Outer floating widgets */}
            <motion.div 
              className="absolute -top-6 -left-6 z-10 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-md dark:bg-slate-800/80"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <span className="flex items-center gap-2 text-sm font-extrabold text-coral">
                🛡️ AI Safety Approved
              </span>
            </motion.div>

            <motion.div 
              className="absolute -bottom-6 -right-6 z-10 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-md dark:bg-slate-800/80"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
            >
              <span className="flex items-center gap-2 text-sm font-extrabold text-teal">
                <FaGraduationCap size={16} /> 100% Kids Safe
              </span>
            </motion.div>

            {/* Colorful custom illustration of kids using device */}
            <div className="relative mx-auto max-w-[340px] overflow-hidden rounded-[36px] bg-gradient-to-tr from-purple/30 via-pink/20 to-teal/30 p-[3px] shadow-2xl shadow-indigo-500/10">
              <div className="rounded-[33px] bg-slate-950 p-3">
                {/* SVG Mockup Screens drawing */}
                <svg viewBox="0 0 320 568" className="h-auto w-full rounded-[24px]">
                  <defs>
                    <clipPath id="screenClip">
                      <rect x="0" y="0" width="320" height="568" rx="24" />
                    </clipPath>
                  </defs>
                  
                  {/* Mock app UI illustration */}
                  <g clipPath="url(#screenClip)">
                    {/* Dark app BG */}
                    <rect width="320" height="568" fill="#13131c" />
                    
                    {/* Dynamic circle layers */}
                    <circle cx="160" cy="180" r="100" fill="#6c5ce7" opacity="0.15" />
                    <circle cx="280" cy="400" r="80" fill="#4ecdc4" opacity="0.1" />

                    {/* Happy SVG Kids character */}
                    <g transform="translate(60, 150)">
                      <circle cx="100" cy="100" r="48" fill="#ffe66d" />
                      {/* Eyes */}
                      <circle cx="85" cy="90" r="4.5" fill="#1a1a24" />
                      <circle cx="115" cy="90" r="4.5" fill="#1a1a24" />
                      <circle cx="87" cy="88" r="1" fill="#fff" />
                      <circle cx="117" cy="88" r="1" fill="#fff" />
                      {/* Smile */}
                      <path d="M 85,108 Q 100,122 115,108" fill="none" stroke="#1a1a24" strokeWidth="3.5" strokeLinecap="round" />
                      {/* Rosy Cheeks */}
                      <circle cx="77" cy="102" r="3" fill="#ff85a2" />
                      <circle cx="123" cy="102" r="3" fill="#ff85a2" />
                      {/* Hair/Cap */}
                      <path d="M 52,100 Q 100,30 148,100 Z" fill="#6c5ce7" opacity="0.8" />
                    </g>

                    {/* SVG Clouds */}
                    <path d="M 20,480 Q 30,460 45,465 Q 60,455 75,470 L 15,470 Z" fill="#4ecdc4" opacity="0.25" />
                    <path d="M 240,110 Q 250,90 265,95 Q 280,85 295,100 L 235,100 Z" fill="#ff85a2" opacity="0.25" />

                    {/* App Overlay details (Logo, Bottom Tabs, etc) */}
                    {/* Header */}
                    <rect x="15" y="20" width="290" height="40" rx="10" fill="rgba(255,255,255,0.06)" />
                    <circle cx="40" cy="40" r="12" fill="#ff6b6b" />
                    <rect x="62" y="32" width="80" height="7" rx="3" fill="white" opacity="0.7" />
                    <rect x="62" y="44" width="45" height="5" rx="2" fill="white" opacity="0.4" />
                    
                    {/* Bottom Nav */}
                    <rect x="15" y="500" width="290" height="48" rx="14" fill="rgba(255,255,255,0.08)" />
                    <circle cx="65" cy="524" r="10" fill="white" opacity="0.3" />
                    <circle cx="160" cy="524" r="12" fill="#4ecdc4" />
                    <circle cx="255" cy="524" r="10" fill="white" opacity="0.3" />
                  </g>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
