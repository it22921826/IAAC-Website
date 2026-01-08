import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plane, Wrench } from 'lucide-react';
import apiClient from '../services/apiClient.js';

function Programs() {
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
    return () => {
      mounted = false;
    };
  }, []);

  // --- GROUPING LOGIC ---
  const coursesByType = extraCourses.reduce((groups, course) => {
    const type = course.courseType || 'Other Programs';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(course);
    return groups;
  }, {});

  const getCategoryIcon = (type) => {
    if (type.includes('Pilot')) return <Plane size={28} />;
    if (type.includes('Practical')) return <Wrench size={28} />;
    return <BookOpen size={28} />;
  };

  return (
    <>
      {/* --- HERO SECTION (Updated Colors & Style) --- */}
      <section className="relative pt-32 md:pt-[160px] pb-24 bg-[#0f172a] overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Programs</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              Comprehensive aviation education combining theoretical excellence with hands-on practical experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- PROGRAM LISTS --- */}
      {Object.keys(coursesByType).length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200">
          {Object.entries(coursesByType).map(([categoryName, courses]) => (
            <section key={categoryName} className="py-16 border-b border-slate-200 last:border-0">
              <div className="container mx-auto px-6">
                <motion.div
                  className="flex items-center gap-3 mb-12"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">{getCategoryIcon(categoryName)}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{categoryName}</h2>
                    <p className="text-slate-500">Explore our available {categoryName.toLowerCase()}.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="grid md:grid-cols-2 gap-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
                >
                  {courses.map((c) => (
                    <CourseCard
                      key={c._id}
                      title={c.title}
                      Icon={categoryName.includes('Pilot') ? Plane : BookOpen}
                      duration={c.duration || '—'}
                      to={`/programs/course/${c._id}`}
                      description={c.shortDescription || ''}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function CourseCard({ title, Icon, description, duration, to }) {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl border border-slate-100 group"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] },
        },
      }}
      whileHover={{ y: -10, boxShadow: '0px 25px 50px -25px rgba(37, 99, 235, 0.25)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
          {duration}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm mb-6 line-clamp-2">{description}</p>
      <Link
        to={to}
        className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-all duration-300 hover:gap-3 hover:brightness-110"
      >
        View Curriculum <span aria-hidden="true">&rarr;</span>
      </Link>
    </motion.div>
  );
}

export default Programs;
