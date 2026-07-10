import React, { useState } from 'react';
import { FiSun, FiMoon, FiMenu, FiX, FiDownload } from 'react-icons/fi';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Safety & Trust', href: '#trust' },
    { name: 'FAQs', href: '#faq' }
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-white/60 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/50 dark:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Colorful SVG Logo */}
        <a href="#" className="flex items-center gap-3">
          <svg viewBox="0 0 100 100" className="h-9 w-9 drop-shadow-md">
            <defs>
              <linearGradient id="navAuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff85a2" />
                <stop offset="50%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#ffe66d" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#navAuraGrad)" />
            <circle cx="50" cy="50" r="32" fill="#4ecdc4" />
            <circle cx="38" cy="45" r="4" fill="#1a1a24" />
            <circle cx="62" cy="45" r="4" fill="#1a1a24" />
            <circle cx="40" cy="43" r="1" fill="#ffffff" />
            <circle cx="64" cy="43" r="1" fill="#ffffff" />
            <path d="M 38,58 Q 50,70 62,58" fill="none" stroke="#1a1a24" strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="52" r="3" fill="#ff85a2" opacity="0.8" />
            <circle cx="70" cy="52" r="3" fill="#ff85a2" opacity="0.8" />
          </svg>
          <span className="font-kids text-xl font-bold tracking-tight bg-gradient-to-r from-coral via-pink to-teal bg-clip-text text-transparent">
            Kids Aura
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-coral transition-colors dark:text-slate-300 dark:hover:text-pink"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme} 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/50 bg-slate-100/30 text-slate-700 hover:bg-slate-200/50 transition-colors dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-300 dark:hover:bg-slate-700/50"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          
          {/* Download CTA Button */}
          <a 
            href="#download"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-coral to-pink px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-coral/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <FiDownload /> Download APK
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={toggleTheme} 
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/50 bg-slate-100/30 text-slate-700 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-300"
          >
            {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/50 bg-white/95 px-6 py-6 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/95 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-coral dark:text-slate-300 dark:hover:text-pink"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coral to-pink py-3 text-sm font-bold text-white shadow-md shadow-coral/20"
            >
              <FiDownload /> Download APK
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
