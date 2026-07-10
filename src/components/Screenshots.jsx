import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiHeart, FiMessageCircle, FiLock, FiShield, FiBarChart2, FiCheck, FiCpu, FiEye } from 'react-icons/fi';

export default function Screenshots() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Reels Scrolling Feed',
      description: 'Swipe through short, child-safe videos. Heart bursts, double-clicks, and winking smiley reactions make viewing interactive and educational.',
      renderScreen: () => (
        <div className="relative h-full w-full bg-slate-950 flex flex-col justify-end p-5">
          {/* Mock Video Graphic */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="h-40 w-40 rounded-full bg-coral/20 animate-pulse" />
            {/* Happy SVG emoji */}
            <svg viewBox="0 0 100 100" className="h-20 w-20 absolute drop-shadow-md">
              <circle cx="50" cy="50" r="40" fill="#ffe66d" />
              <circle cx="36" cy="45" r="4" fill="#1a1a24" />
              <circle cx="64" cy="45" r="4" fill="#1a1a24" />
              <path d="M 38,58 Q 50,70 62,58" fill="none" stroke="#1a1a24" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          {/* Action sidebar */}
          <div className="absolute right-3 bottom-24 flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-slate-900/60 border border-white/20 flex items-center justify-center text-coral">
                <FiHeart fill="var(--color-coral)" />
              </div>
              <span className="text-[10px] text-white mt-1">342</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-slate-900/60 border border-white/20 flex items-center justify-center text-white">
                <FiMessageCircle />
              </div>
              <span className="text-[10px] text-white mt-1">12</span>
            </div>
          </div>

          {/* Details Overlay */}
          <div className="flex flex-col gap-2 z-10 text-left">
            <span className="text-yellow-300 text-xs font-bold flex items-center gap-1">@nature_kids</span>
            <span className="text-xs text-white">Chubby Panda Eating Fresh Bamboo! 🐼</span>
            <span className="text-[9px] bg-white/25 self-start px-2 py-0.5 rounded-full font-bold">ANIMALS</span>
          </div>

          {/* Navigation Bar */}
          <div className="h-12 border-t border-white/5 bg-slate-900/90 mt-5 rounded-xl flex justify-around items-center">
            <div className="h-1.5 w-10 bg-teal rounded-full" />
            <div className="h-1.5 w-10 bg-white/20 rounded-full" />
            <div className="h-1.5 w-10 bg-white/20 rounded-full" />
          </div>
        </div>
      )
    },
    {
      title: 'AI Safety Moderation',
      description: 'Every uploaded video triggers an AI-powered Moderate scan checking NSFW, violence, drugs, and profanity tags, computing a Safe Score.',
      renderScreen: () => (
        <div className="h-full w-full bg-[#12121a] p-5 flex flex-col gap-4 text-left">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <FiCpu className="text-pink animate-spin" />
            <span className="text-xs font-bold text-white">AI Safety Scanner</span>
          </div>

          {/* Scan preview */}
          <div className="h-32 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-teal shadow-[0_0_10px_var(--color-teal)] animate-[scanMotion_2s_infinite_ease-in-out]" />
            <span className="text-[10px] text-slate-500">Checking frames...</span>
          </div>

          {/* Scan Logs */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-white/5 font-mono text-[9px] text-teal-400 flex flex-col gap-1">
            <div>🤖 Initializing Kids Aura AI Engine...</div>
            <div>🔍 Frames Check: Safe (No adult elements)</div>
            <div>🎙️ Audio: Safe (No curses detected)</div>
          </div>

          {/* Safe Score Shield */}
          <div className="flex items-center gap-3 bg-teal/10 border border-teal/20 p-3 rounded-xl">
            <FiShield size={24} className="text-teal" />
            <div>
              <div className="text-[10px] text-slate-400">Moderation Safe Index</div>
              <div className="text-sm font-black text-teal">98% Safety Score</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Parent Settings & PIN Lock',
      description: 'PIN protected parent dashboard holds usage analytics stats (minutes watched), categories toggles, and custom keyword filters.',
      renderScreen: () => (
        <div className="h-full w-full bg-[#14141d] p-5 flex flex-col gap-4 text-left text-white overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold">Parent Controls</span>
            <span className="text-[9px] bg-purple/20 text-purple-300 border border-purple-300/30 px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>

          {/* Usage charts */}
          <div className="flex flex-col gap-2 bg-slate-950/40 border border-white/5 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 flex items-center gap-1"><FiBarChart2 /> Watch Time</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[9px] text-slate-300">
                <span>Science</span>
                <span>45%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-teal rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between text-[9px] text-slate-300">
                <span>Animals</span>
                <span>35%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[35%] bg-yellow rounded-full" />
              </div>
            </div>
          </div>

          {/* Allowed Categories switches */}
          <div className="flex flex-col gap-2 bg-slate-950/40 border border-white/5 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400">Permitted Categories</span>
            <div className="flex flex-wrap gap-1.5">
              {['Science', 'Animals', 'Funny'].map(cat => (
                <span key={cat} className="text-[9px] bg-teal/20 text-teal-300 border border-teal-300/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <FiCheck /> {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative py-20 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
            Explore the <span className="bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent">Kids Aura App</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Look inside the interface screens designed for seamless child interaction and parent configuration.
          </p>
        </div>

        {/* Carousel Block */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          {/* Slide Description Panel */}
          <div className="text-center lg:col-span-5 lg:text-left">
            <h3 className="font-kids text-2xl font-bold text-slate-800 dark:text-white">
              {slides[activeSlide].title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {slides[activeSlide].description}
            </p>

            {/* Slider Dots */}
            <div className="mt-8 flex justify-center gap-2 lg:justify-start">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-8 bg-coral' : 'w-2.5 bg-slate-300 dark:bg-slate-700'}`}
                />
              ))}
            </div>

            {/* Slide Navigation Buttons */}
            <div className="mt-6 flex justify-center gap-3 lg:justify-start">
              <button 
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Smartphone Screen Simulator */}
          <div className="flex justify-center lg:col-span-7">
            <div className="relative h-[600px] w-[290px] rounded-[48px] bg-slate-900 border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Device Camera Notch */}
              <div className="absolute top-0 left-50% transform -translate-x-50% w-32 h-6 bg-slate-800 rounded-b-xl z-20 flex justify-center items-center">
                <div className="h-1 w-8 bg-black rounded-full" />
              </div>

              {/* Slider Views */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.35 }}
                    className="h-full w-full"
                  >
                    {slides[activeSlide].renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
