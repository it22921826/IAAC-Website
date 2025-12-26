import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function HeroSection() {
  return (
    <motion.section
      id="home"
      className="relative w-full bg-slate-900 pt-[140px] overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.16, 0.84, 0.44, 1], when: 'beforeChildren' }
        }
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 -left-32 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 60, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-10 right-[-120px] h-80 w-80 rounded-full bg-sky-500/20 blur-3xl"
          animate={{ x: [0, -80, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[85vh] relative">
        
        {/* --- LEFT SIDE: TEXT CONTENT --- */}
        <motion.div
          className="flex-1 flex flex-col justify-center px-6 py-16 lg:px-20 lg:py-0 z-10 bg-slate-900/80 backdrop-blur"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.9, ease: [0.16, 0.84, 0.44, 1], delayChildren: 0.2, staggerChildren: 0.1 }
            }
          }}
        >
          
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 self-start rounded-full border border-blue-700 bg-blue-900/30 px-4 py-1.5 mb-8"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-blue-200">
              Best Airline Training College In Asia
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.33, 1, 0.68, 1] } } }}
          >
            International Airline & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              Aviation College
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
          >
            Authorized by the <strong className="text-white">TVEC</strong> and Ministry of Skills Development. 
            Join Sri Lanka's premier aviation institute in Colombo, empowering the next generation of professionals since 2015.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
          >
            <Link
              to="/apply-now"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/50 transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:brightness-110"
            >
              Apply for 2025 Intake
            </Link>
            <a href="#about" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 hover:scale-105 hover:brightness-110">
              Explore Courses
              <span aria-hidden="true">&rarr;</span>
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-3 gap-6 border-t border-slate-800 pt-8 max-w-lg"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.12 } } }}
          >
            <StatItem number="2015" label="Est." />
            <StatItem number="100%" label="TVEC Approved" />
            <StatItem number="2x" label="Award Winner" />
          </motion.div>
        </motion.div>

        {/* --- RIGHT SIDE: IMAGE CONTAINER --- */}
        {/* Fixed: Width 45% (balanced) and h-full (fills height) */}
        <div className="relative w-full lg:w-[45%] h-64 lg:h-full overflow-hidden bg-slate-900">
          
          {/* The Image */}
          <motion.img 
            src="/hero4.png" 
            alt="IAAC Students Group"
            className="w-full h-full object-cover object-top"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 22, ease: 'easeOut' }}
          />
          
          {/* Gradient Overlay (Left edge blend) */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent"></div>
          
          {/* Bottom Gradient (Mobile blend) */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent lg:hidden"></div>
        </div>

      </div>
    </motion.section>
  );
}

// Small helper component for the stats
function StatItem({ number, label }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
      <p className="text-2xl md:text-3xl font-bold text-white">{number}</p>
      <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">{label}</p>
    </motion.div>
  );
}

export default HeroSection;