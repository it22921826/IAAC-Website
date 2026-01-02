import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plane, Building2, ArrowRight } from 'lucide-react';

// --- SLIDESHOW CONFIGURATION ---
const heroImages = [
  '/hero1.png',
  '/hero2.png',
  '/hero4.png',
];

const SLIDE_DURATION = 5000;

function HeroSection() {
  const [index, setIndex] = useState(0);

  // Auto-slide Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  // --- BRANCH DATA ---
  // Reordered: City -> Airport (Center) -> Center
  const branches = [
    { 
      id: 1, 
      name: "IAAC CITY", 
      icon: Building2, 
      desc: "Colombo Campus", 
      color: "hover:bg-blue-600 active:bg-blue-700", // Blue Theme
      borderColor: "hover:border-blue-400"
    },
    { 
      id: 2, 
      name: "AIRPORT ACADEMY", // NOW IN THE CENTER
      icon: Plane, 
      desc: "Katunayake Hangar", 
      color: "hover:bg-purple-600 active:bg-purple-700", // Purple Theme
      borderColor: "hover:border-purple-400"
    },
    { 
      id: 3, 
      name: "IAAC CENTER", 
      icon: MapPin, 
      desc: "Main Hub", 
      color: "hover:bg-sky-600 active:bg-sky-700", // Sky Theme
      borderColor: "hover:border-sky-400"
    },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-slate-900 flex flex-col justify-center items-center">
      
      {/* 1. BACKGROUND SLIDESHOW */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={heroImages[index]} 
            alt="Aviation Academy" 
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN HERO TEXT */}
      <div className="relative z-10 container mx-auto px-6 text-center mt-[-60px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-100 tracking-wide uppercase">Admissions Open 2025</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6 drop-shadow-lg">
            Soar Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-200">
              The Horizon
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md">
            Join Asia's premier airline training college. We craft professionals for Pilots, Cabin Crew, and Ground Operations with global standards.
          </p>
        </motion.div>
      </div>

      {/* 3. ATTRACTIVE BRANCH BUTTONS */}
      <motion.div 
        className="absolute bottom-10 left-0 right-0 z-20 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto grid md:grid-cols-3 gap-6 max-w-5xl">
          {branches.map((branch) => (
            <button 
              key={branch.id}
              className={`group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-95 ${branch.borderColor}`}
            >
              {/* Animated Background Fill (Color appears on Hover/Click) */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out ${branch.color} -z-10`} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon Circle */}
                  <div className="p-3 bg-white/20 rounded-full text-white group-hover:bg-white group-hover:text-slate-900 transition-colors duration-300">
                    <branch.icon size={24} />
                  </div>
                  {/* Text */}
                  <div>
                    <h3 className="font-bold text-lg text-white tracking-wide">{branch.name}</h3>
                    <p className="text-slate-300 text-xs uppercase tracking-wider font-medium group-hover:text-white/90">
                      {branch.desc}
                    </p>
                  </div>
                </div>
                
                {/* Arrow Icon */}
                <ArrowRight className="text-white/50 w-5 h-5 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>

    </section>
  );
}

export default HeroSection;