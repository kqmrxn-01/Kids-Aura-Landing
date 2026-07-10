import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiInfo, FiSmartphone } from 'react-icons/fi';
import { FaAndroid } from 'react-icons/fa';

export default function DownloadSection() {
  return (
    <section id="download" className="relative py-24 bg-gradient-to-tr from-purple/10 via-pink/5 to-teal/10">
      {/* Sparkle background details */}
      <div className="circle-bg top-20 left-20 h-[250px] w-[250px] bg-coral/20" />
      <div className="circle-bg bottom-20 right-20 h-[300px] w-[300px] bg-teal/20" />

      <div className="mx-auto max-w-5xl px-6">
        <motion.div 
          className="glass border border-white/20 rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Overlay glow circles */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-pink/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-teal/20 blur-3xl" />

          {/* Icon Badge */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-coral to-pink text-white shadow-lg shadow-coral/30">
            <FaAndroid size={32} />
          </div>

          <h2 className="font-kids text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
            Get the <span className="bg-gradient-to-r from-coral to-pink bg-clip-text text-transparent">Kids Aura</span> App Now
          </h2>
          
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Download the official Android application package (APK) directly to your device storage to establish a safe, AI-moderated video scrolling feed.
          </p>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col justify-center items-center gap-4 sm:flex-row">
            {/* The APK download target URL template */}
            <a
              href="./kids-aura.apk"
              download="kids-aura.apk"
              className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-coral to-pink px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-coral/30 hover:scale-[1.04] active:scale-[0.98] transition-all"
            >
              <FiDownload size={18} /> Download Kids Aura APK
            </a>
          </div>

          {/* Install instructions link trigger */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><FiSmartphone /> Target: Android 8.0+</span>
            <span className="flex items-center gap-1.5">⚖️ Package File Size: ~15MB</span>
          </div>

          {/* Installation guide note */}
          <div className="mx-auto mt-12 max-w-lg rounded-2xl bg-white/40 p-4 text-xs leading-relaxed text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            💡 <strong>Quick Install Tip:</strong> Ensure that "Install from Unknown Sources" is enabled in your Android security settings. Open the downloaded <code>kids-aura.apk</code> file to begin installation.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
