import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Plane, 
  Building2, 
  Ticket, 
  Package, 
  Award,
  Rocket
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

function TrainingCourses() {
  const [extraCourses, setExtraCourses] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await apiClient.get('/api/courses');
        if (mounted) setExtraCourses(res.data.items || []);
      } catch (_) {
        if (mounted) setExtraCourses([]);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-[160px] pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Training <span className="text-blue-500">Programs</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Comprehensive aviation education combining theoretical excellence with hands-on practical experience.
          </p>
        </div>
      </section>

      {/* ====================================================
          PART 1: AIRLINE & AVIATION PROGRAMS (Diplomas)
         ==================================================== */}
      <section id="aviation-programs" className="py-20 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Award size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Airline & Aviation Programs</h2>
              <p className="text-slate-500">Professional Diplomas for ground and cabin careers.</p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
          >
            <CourseCard 
              title="Diploma in Airline Cabin Crew" 
              Icon={Users} 
              duration="6 Months"
              to="/training/cabin-crew"
              description="Comprehensive training on in-flight safety, passenger service, grooming, and emergency procedures." 
            />
            <CourseCard 
              title="Diploma in Airport Ground Operations" 
              Icon={Building2} 
              duration="4 Months"
              to="/training/ground-operations"
              description="Master terminal operations, check-in systems, ramp handling, and passenger assistance protocols." 
            />
            <CourseCard 
              title="Diploma in Airline Ticketing, Reservations & Marketing" 
              Icon={Ticket} 
              duration="4 Months"
              to="/training/ticketing-marketing"
              description="Gain expertise in GDS (Amadeus/Galileo), travel management, and airline marketing strategies." 
            />
            <CourseCard 
              title="Diploma in Air Cargo & Logistics" 
              Icon={Package} 
              duration="4 Months"
              to="/training/cargo-logistics"
              description="Understand air freight operations, dangerous goods regulations (DGR), and global supply chain logistics." 
            />
          </motion.div>
        </div>
      </section>

      {extraCourses.length > 0 && (
        <section id="courses" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6">
            <motion.div
              className="flex items-center gap-3 mb-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
                <BookOpen size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Additional Courses</h2>
                <p className="text-slate-500">Courses published via the Admin Dashboard.</p>
              </div>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            >
              {extraCourses.map((c) => (
                <CourseCard
                  key={c._id}
                  title={c.title}
                  Icon={BookOpen}
                  duration={c.duration || '—'}
                  to="#"
                  description=""
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ====================================================
          PART 2: PILOT TRAINING PROGRAMS (Coming Soon)
         ==================================================== */}
      <section id="pilot-training" className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-[140px]">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Plane size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Pilot Training Programs</h2>
              <p className="text-slate-500">Your pathway to the cockpit: PPL, CPL & ATPL.</p>
            </div>
          </motion.div>

          {/* Coming Soon Card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-20 text-center shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute top-0 left-1/4 h-64 w-64 -translate-y-1/2 bg-blue-500/20 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-1/2 bg-indigo-500/20 blur-[100px]" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700 shadow-xl">
                <Rocket size={40} className="text-blue-400" />
              </div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Coming Soon for 2025
                </span>
              </div>

              <h3 className="mb-4 text-3xl md:text-4xl font-extrabold text-white">
                Preparing for Takeoff
              </h3>
              
              <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
                We are currently finalizing our state-of-the-art flight training curriculum. 
                Full PPL, CPL, and ATPL courses will be launching soon.
              </p>

              <div className="mt-8">
                <button className="rounded-lg bg-white px-8 py-3 text-sm font-bold text-slate-900 transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:brightness-110">
                  Notify Me When Launched
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: PRACTICAL TRAINING (Updated)
         ========================================= */}
      <section id="practical" className="py-20 bg-white border-t border-slate-200 scroll-mt-[140px]">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Keeping header icon consistent, but removed from cards below */}
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Practical Training</h2>
              <p className="text-slate-500">Hands-on drills and real-world simulation exercises.</p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
          >
            
            <PracticalCard 
              title="Fire & Rescue Training"
              // Placeholder image path - replace with your own images (600x400 recommended)
              imageSrc="/images/practical-fire.jpg" 
              description="Real-world scenarios teaching the identification and extinguishing of fires using standard aviation equipment."
            />

            <PracticalCard 
              title="Water Survival Training"
              imageSrc="/images/practical-water.jpg"
              description="Intensive pool sessions simulating emergency landings, life-raft deployment, and survival swimming."
            />

            <PracticalCard 
              title="Grooming & Deportment"
              imageSrc="/images/practical-grooming.jpg"
              description="Workshops on professional appearance, makeup application, and the poise required for international airlines."
            />

            <PracticalCard 
              title="Customer Service Program"
              imageSrc="/images/practical-service.jpg"
              description="Advanced training in passenger psychology, handling difficult situations, and delivering VIP service."
            />

            <PracticalCard 
              title="Interview Ready Programs"
              imageSrc="/images/practical-interview.jpg"
              description="Mock interviews and CV workshops designed specifically for Airline Cabin Crew and Ground Staff recruitments."
            />

            <PracticalCard 
              title="Industry Related Field Visits"
              imageSrc="/images/practical-visit.jpg"
              description="Guided tours to airports, hangars, and aviation centers to experience the operational environment firsthand."
            />

          </motion.div>
        </div>
      </section>
    </>
  );
}

// --- Helper Components ---

function CourseCard({ title, Icon, description, duration, to }) {
  return (
    <motion.div
      className="bg-slate-50 p-8 rounded-2xl border border-slate-100 group"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }
        }
      }}
      whileHover={{ y: -10, boxShadow: '0px 25px 50px -25px rgba(37, 99, 235, 0.45)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
          {duration}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed text-sm mb-6">
        {description}
      </p>
      <Link to={to} className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-all duration-300 hover:gap-3 hover:brightness-110">
        View Curriculum <span aria-hidden="true">&rarr;</span>
      </Link>
    </motion.div>
  );
}

// Updated PracticalCard to use Images instead of Icons
function PracticalCard({ title, imageSrc, description }) {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }
        }
      }}
      whileHover={{ y: -8, boxShadow: '0px 18px 45px -28px rgba(15, 23, 42, 0.6)' }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
    >
      {/* Image Container */}
      <div className="h-48 w-full overflow-hidden bg-slate-200 relative">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          // Fallback if image fails to load
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=Image+Upload+Needed'; 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default TrainingCourses;