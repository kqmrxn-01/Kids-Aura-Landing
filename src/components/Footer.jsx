import React from 'react';
import { FiMail, FiTwitter, FiYoutube, FiGithub, FiInstagram, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const footerLinks = {
    app: [
      { name: 'About', href: '#' },
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'COPPA Compliance', href: '#' }
    ]
  };

  return (
    <footer className="border-t border-slate-200/50 bg-white py-12 transition-colors duration-300 dark:border-slate-800/40 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-sm">
                <defs>
                  <linearGradient id="footAuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff85a2" />
                    <stop offset="50%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#ffe66d" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#footAuraGrad)" />
                <circle cx="50" cy="50" r="32" fill="#4ecdc4" />
                <circle cx="38" cy="45" r="4" fill="#1a1a24" />
                <circle cx="62" cy="45" r="4" fill="#1a1a24" />
                <path d="M 38,58 Q 50,70 62,58" fill="none" stroke="#1a1a24" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="font-kids text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                Kids Aura
              </span>
            </div>
            
            <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Kids Aura provides safe, AI-moderated short videos with strict parental control features to ensure a safe learning and entertainment digital space.
            </p>
            
            {/* Contact Email */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FiMail className="text-coral" />
              <a href="mailto:support@kidsaura.com" className="hover:text-coral transition-colors">
                support@kidsaura.com
              </a>
            </div>
          </div>

          {/* App Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-kids text-sm font-bold text-slate-800 dark:text-white">Kids Aura App</h4>
            <div className="flex flex-col gap-2.5">
              {footerLinks.app.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm text-slate-500 hover:text-coral transition-colors dark:text-slate-400 dark:hover:text-pink"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-kids text-sm font-bold text-slate-800 dark:text-white">Legal & Safety</h4>
            <div className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm text-slate-500 hover:text-coral transition-colors dark:text-slate-400 dark:hover:text-pink"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Socials & Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100/50 pt-8 sm:flex-row dark:border-slate-800/40">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Kids Aura. All rights reserved.
          </p>

          {/* Social Icons list */}
          <div className="mt-4 flex gap-4 sm:mt-0">
            <a href="#" className="text-slate-400 hover:text-coral transition-colors"><FiTwitter size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-coral transition-colors"><FiYoutube size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-coral transition-colors"><FiInstagram size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-coral transition-colors"><FiGithub size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
