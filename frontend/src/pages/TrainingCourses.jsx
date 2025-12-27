import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
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

 

export default TrainingCourses;