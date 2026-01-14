import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plane, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ---------------- SLIDESHOW CONFIG ---------------- */
const heroImages = [
  '/hero1.png',
  '/hero2.png',
  '/hero4.png',
];

const SLIDE_DURATION = 5000;

function HeroSection() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  /* Auto slide */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  /* Branches */
  const branches = [
    {
      id: 1,
      name: 'IAAC CITY',
      branchKey: 'iaacCity',
      icon: Building2,
      desc: 'Colombo 10',
      color: 'hover:bg-blue-600 active:bg-blue-700',
      borderColor: 'hover:border-blue-400',
    },
    {
      id: 2,
      name: 'AIRPORT ACADEMY',
      branchKey: 'airportAcademy',
      icon: Plane,
      desc: 'Rathmalana Airport',
      color: 'hover:bg-purple-600 active:bg-purple-700',
      borderColor: 'hover:border-purple-400',
    },
    {
      id: 3,
      name: 'IAAC CENTRAL',
      branchKey: 'iaacCenter',
      icon: MapPin,
      desc: 'Kurunagala ',
      color: 'hover:bg-sky-600 active:bg-sky-700',
      borderColor: 'hover:border-sky-400',
    },
  ];

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-slate-900 flex flex-col justify-center">

      {/* ---------- BACKGROUND SLIDESHOW ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={heroImages[index]}
            alt="Aviation Academy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/95" />
        </motion.div>
      </AnimatePresence>

      {/* ---------- HERO CONTENT ---------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center pt-28 sm:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-blue-100 uppercase tracking-wider">
              Admissions Open 2025
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-200">
              Best Airline Training College 
            </span>
            <br />
            in Asia 
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-xl sm:max-w-2xl leading-relaxed mb-10">
            Join Asia's premier airline training college. We craft professionals
            for Cabin Crew, Cargo & Logistics, and Ground Operations with global standards.
          </p>
        </motion.div>
      </div>

      {/* ---------- BRANCH BUTTONS ---------- */}
      <motion.div
        className="relative z-20 px-4 sm:px-6 pb-10 sm:pb-14"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <button
              key={branch.id}
              type="button"
              onClick={() => navigate(`/programs?branch=${encodeURIComponent(branch.branchKey)}`)}
              className={`group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95 ${branch.borderColor}`}
            >
              {/* Hover Fill */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${branch.color} -z-10`}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-white/20 rounded-full text-white group-hover:bg-white group-hover:text-slate-900 transition">
                    <branch.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-sm sm:text-base text-white tracking-wide">
                      {branch.name}
                    </h3>
                    <p className="font-poppins text-[10px] sm:text-xs uppercase tracking-wider text-slate-300">
                      {branch.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
