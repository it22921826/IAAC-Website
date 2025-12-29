import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- SLIDESHOW CONFIGURATION ---
// Uses hero images placed in frontend/public (hero1.png, hero2.png, hero3.png, hero4.png)
const heroImages = [
  '/hero1.png',
  '/hero2.png',
  '/hero4.png',
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

function HeroSection() {
  const [index, setIndex] = useState(0);

  // Auto-slide Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-slate-900">
      
      {/* --- BACKGROUND SLIDESHOW --- */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={heroImages[index]} 
            alt="Aviation Academy" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/35 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* --- HERO TEXT CONTENT --- */}
      <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-center">
        <motion.div 
          className="max-w-2xl text-white"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-100 tracking-wide uppercase">Admissions Open 2025</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Soar Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-200">
              The Horizon
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
            Join Asia's premier airline training college. We craft professionals for Pilots, Cabin Crew, and Ground Operations with global standards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/apply-now" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 group">
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link to="/training" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm text-white font-bold rounded-xl transition-all">
              View Courses
              <ChevronRight className="w-5 h-5 opacity-50" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- SLIDER DOTS --- */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === index ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;