import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Target, Compass 
} from 'lucide-react';

function About() {
  const fastTransition = { duration: 0.5, ease: 'easeOut' };

  return (
    <>
      {/* --- SECTION 1: MISSION & VISION (Now the top section) --- */}
      <motion.section
        className="pt-40 pb-20 bg-white" // Added pt-40 for navbar clearance
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ 
          hidden: { opacity: 0, y: 30 }, 
          visible: { opacity: 1, y: 0, transition: { ...fastTransition, staggerChildren: 0.1 } } 
        }}
      >
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
          
          {/* Vision Card */}
          <motion.div
            className="bg-[#1e3a8a] text-white p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-blue-900/20 group"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: fastTransition } }}
            whileHover={{ y: -5 }}
          >
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
             <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
               <Compass className="text-blue-300 w-8 h-8" /> 
               Our Vision
             </h3>
             <p className="text-blue-100 leading-relaxed text-lg">
               To be the premier source for education, a unique workforce training institute, and create skilled and value-based resource professionals in the aviation industry.
             </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            className="bg-blue-600 text-white p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-blue-600/20 group"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: fastTransition } }}
            whileHover={{ y: -5 }}
          >
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
             <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
               <Target className="text-blue-200 w-8 h-8" />
               Our Mission
             </h3>
             <p className="text-blue-50 leading-relaxed text-lg">
               To nurture and transform competent students into confident candidates ready to take up challenging careers in the aviation industry through quality education.
             </p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- SECTION 2: FACULTY & OBJECTIVES --- */}
      <motion.section
        className="py-20 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ 
          hidden: { opacity: 0, y: 30 }, 
          visible: { opacity: 1, y: 0, transition: { ...fastTransition, staggerChildren: 0.1 } } 
        }}
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
          
          {/* Objectives Content */}
          <motion.div className="space-y-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: fastTransition } }}>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Objectives</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When we commenced in 2015, our primary objective was to provide career guidance and support to school leavers, creating a clear academic pathway to lucrative opportunities in the fast-growing Airline and Aviation industry.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We help unemployed youth secure placements with leading Airlines, Leisure Agents, and Freight Forwarders by introducing job-oriented operational level courses.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
              <div className="shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Quality Management System (QMS)</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  IAAC maintains records to comply with TVEC QMS standards, ensuring continuous improvement and compliance with statutory requirements.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Faculty List */}
          <motion.div variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Expert Faculty</h2>
            <div className="grid gap-4">
              <FacultyItem 
                role="CEO / Chairman" 
                desc="Qualified professor with over 30 years in the higher education field." 
              />
              <FacultyItem 
                role="Head of Training" 
                desc="Over 40 years of aviation experience, including 25 years in senior management." 
              />
              <FacultyItem 
                role="Course Coordinators" 
                desc="All coordinators possess over 25 years of hands-on experience in the aviation industry." 
              />
              <FacultyItem 
                role="International Reach" 
                desc="We proudly train foreign students from India, Maldives, and the Philippines." 
              />
            </div>
          </motion.div>

        </div>
      </motion.section>
    </>
  );
}

// --- HELPER COMPONENTS ---

function FacultyItem({ role, desc }) {
  return (
    <motion.div
      className="flex gap-4 p-5 rounded-xl bg-white border border-slate-200 transition-all"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }
      }}
      whileHover={{ x: 5, borderColor: 'rgb(37 99 235)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="mt-1 shrink-0">
        <CheckCircle2 className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-lg">{role}</h4>
        <p className="text-slate-600 text-sm mt-1 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default About;