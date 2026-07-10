import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Screenshots from './components/Screenshots';
import ParentsTrust from './components/ParentsTrust';
import Faq from './components/Faq';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Sync theme changes with document body class list
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <Features />
      <HowItWorks />
      <Screenshots />
      <ParentsTrust />
      <Faq />
      <DownloadSection />
      <Footer />
    </div>
  );
}
