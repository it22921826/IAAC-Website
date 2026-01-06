import React from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Users,
  Building2,
  Ticket,
  Package,
  TrendingUp,
  CheckCircle2,
  Target,
  Compass,
} from 'lucide-react';

function WelcomeToIAAC() {
  const fastTransition = { duration: 0.5, ease: 'easeOut' };

  return (
    <>
      {/* --- SECTION 1: INTRO & VIDEO --- */}
      <motion.section
        id="welcome"
        className="py-20 bg-white scroll-mt-[140px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 28 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.55,
              ease: [0.16, 0.84, 0.44, 1],
              when: 'beforeChildren',
              staggerChildren: 0.08,
            },
          },
        }}
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: 'easeOut', staggerChildren: 0.08 },
              },
            }}
          >
            <motion.div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
              Since 2015
            </motion.div>
            <motion.h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Welcome to <span className="text-[#2563EB]">IAAC</span>
            </motion.h2>
            <motion.p className="text-slate-600 text-lg leading-relaxed">
              International Airline and Aviation College (IAAC) is a private educational institute based in Sri Lanka,
              strategically located in the heart of Colombo. We are authorized and monitored by the
              <strong> TVEC</strong> (Tertiary and Vocational Education Commission) under the Ministry of Skills Development.
            </motion.p>
            <motion.p className="text-slate-600 text-lg leading-relaxed">
              We cater to about 20,000 potential students near 12 leading national schools, providing top-tier vocational
              training in Airline and Aviation studies.
            </motion.p>

            <motion.div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-4 flex items-start gap-3">
              <div className="mt-1 text-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-800">Award Winner 2020-2021</p>
                <p className="text-sm text-slate-600">
                  Recognized as the "Best Airline Training College" in Sri Lanka twice.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] },
              },
            }}
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/0X1SG86awVM"
              title="IAAC Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </motion.section>

      {/* --- SECTION 2: OUR COURSES --- */}
      <motion.section
        className="py-24 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { ...fastTransition, staggerChildren: 0.08 } },
        }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: fastTransition },
            }}
          >
            <h2 className="text-3xl font-bold text-slate-900">Our Specialized Training</h2>
            <p className="mt-4 text-slate-600 text-lg">
              We offer specialized training courses designed to meet the future employment needs of the aviation industry.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <CourseCard
              title="Airline Cabin Crew"
              Icon={Users}
              description="Comprehensive training for aspiring flight attendants focusing on safety, grooming, and in-flight service."
            />
            <CourseCard
              title="Pilot Training (PPL/CPL)"
              Icon={Plane}
              description="Full PPL, ATPL, CPL, and MER Airline Pilot training pathways for future captains."
            />
            <CourseCard
              title="Airport Ground Ops"
              Icon={Building2}
              description="Mastering passenger handling, check-in procedures, terminal operations, and ramp safety."
            />
            <CourseCard
              title="Ticketing & Reservations"
              Icon={Ticket}
              description="Expert training in global airline ticketing systems (GDS), reservations, and travel management."
            />
            <CourseCard
              title="Cargo & Logistics"
              Icon={Package}
              description="Specialized courses in air cargo operations, supply chain management, and global logistics."
            />
            <CourseCard
              title="Marketing & Sales"
              Icon={TrendingUp}
              description="Strategic marketing skills tailored specifically for the competitive airline and travel industry."
            />
          </motion.div>
        </div>
      </motion.section>

      {/* --- SECTION 3: MISSION & VISION --- */}
      <motion.section
        className="py-20 bg-white"
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
            whileHover={{ y: -5, boxShadow: '0px 22px 45px -25px rgba(30, 58, 138, 0.65)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
            whileHover={{ y: -5, boxShadow: '0px 22px 45px -25px rgba(37, 99, 235, 0.6)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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

      {/* --- SECTION 4: FACULTY & OBJECTIVES --- */}
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

// --- HELPER COMPONENTS (Must be included!) ---

function CourseCard({ title, Icon, description }) {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm group"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
      }}
      whileHover={{ y: -8, boxShadow: '0px 25px 50px -28px rgba(15, 23, 42, 0.35)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="mb-6 inline-block p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon strokeWidth={1.5} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}

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

export default WelcomeToIAAC;