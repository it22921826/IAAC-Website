import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plane, Wrench, Building2, MapPin } from 'lucide-react'; // Added icons
import apiClient from '../services/apiClient.js';

// Updated BRANCHES with icons
const BRANCHES = [
  { key: 'iaacCity', label: 'IAAC City Campus', icon: <Building2 size={18} /> },
  { key: 'airportAcademy', label: 'Airport Academy', icon: <Plane size={18} /> },
  { key: 'iaacCenter', label: 'Kurunegala Center', icon: <MapPin size={18} /> },
];

const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
};

const isCourseAvailableAtBranch = (course, branchKey) => {
  const branchPrices = course?.branchPrices && typeof course.branchPrices === 'object' ? course.branchPrices : null;
  if (!branchPrices) return true;

  const keys = BRANCHES.map((b) => b.key);
  const anyBranchHasValue = keys.some((k) => normalizeValue(branchPrices?.[k]));

  // If branchPrices exists but is effectively empty, treat as available.
  if (!anyBranchHasValue) return true;

  return !!normalizeValue(branchPrices?.[branchKey]);
};

function Programs() {
  const [extraCourses, setExtraCourses] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('iaacCity');
  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    const requested = (searchParams.get('branch') || '').trim();
    if (!requested) return;
    if (BRANCHES.some((b) => b.key === requested) && requested !== selectedBranch) {
      setSelectedBranch(requested);
    }
    // Only react to URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // --- GROUPING LOGIC ---
  const visibleCourses = extraCourses.filter((c) => c.courseType !== 'Practical Training');
  const branchFilteredCourses = visibleCourses.filter((c) => isCourseAvailableAtBranch(c, selectedBranch));

  const coursesByType = branchFilteredCourses.reduce((groups, course) => {
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
      {/* --- HERO SECTION --- */}
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
      <div className="bg-slate-50 border-t border-slate-200 min-h-screen">
        
        {/* --- ATTRACTIVE BRANCH SELECTOR --- */}
        <div className="sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm py-8 border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Select Your Campus</h2>
              </div>
              
              <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto max-w-full">
                {BRANCHES.map((b) => {
                  const active = b.key === selectedBranch;
                  return (
                    <button
                      key={b.key}
                      onClick={() => setSelectedBranch(b.key)}
                      className={`
                        relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap
                        ${active 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-100' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }
                      `}
                    >
                      {b.icon}
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Course lists */}
        {Object.keys(coursesByType).length > 0 ? (
          Object.entries(coursesByType).map(([categoryName, courses]) => (
            <section key={categoryName} className="py-16 border-b border-slate-200 last:border-0 bg-white first:pt-10">
              <div className="container mx-auto px-6">
                <motion.div
                  className="flex items-center gap-4 mb-10"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                    {getCategoryIcon(categoryName)}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{categoryName}</h2>
                    <p className="text-slate-500 mt-1">Available programs at <span className="font-semibold text-blue-600">{BRANCHES.find(b => b.key === selectedBranch)?.label}</span></p>
                  </div>
                </motion.div>

                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                >
                  {courses.map((c) => (
                    <CourseCard
                      key={c._id}
                      title={c.title}
                      Icon={categoryName.includes('Pilot') ? Plane : BookOpen}
                      duration={c.duration || '—'}
                      to={`/programs/course/${c._id}`}
                      branchKey={selectedBranch}
                      description={c.shortDescription || ''}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          ))
        ) : (
          <div className="container mx-auto px-6 py-32 text-center">
            <div className="inline-block p-6 bg-slate-100 rounded-full mb-4">
              <BookOpen size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No courses available</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              There are currently no {BRANCHES.find(b => b.key === selectedBranch)?.label} programs listed in this category.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CourseCard({ title, Icon, description, duration, to, branchKey }) {
  const href = branchKey ? `${to}?branch=${encodeURIComponent(branchKey)}` : to;
  return (
    <Link
      to={href}
      className="block h-full focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-2xl"
      aria-label={`View details for ${title}`}
    >
      <motion.div
        className="group bg-white rounded-2xl border border-slate-100 p-6 h-full flex flex-col hover:border-blue-200 transition-all duration-300 cursor-pointer"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
          },
        }}
        whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)' }}
      >
        <div className="flex justify-between items-start mb-5">
          <div className="p-3 bg-slate-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
            {duration}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}

export default Programs;