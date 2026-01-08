import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Target, Compass, Award, BookOpen, UserCheck, ShieldCheck 
} from 'lucide-react';

function About() {
  const fastTransition = { duration: 0.5, ease: 'easeOut' };

  return (
    <>
      {/* --- SECTION 1: HERO - LIFE AT IAAC (New Addition) --- */}
      <section className="relative pt-40 pb-16 bg-[#0f172a] overflow-hidden">
        {/* Background Gradient Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">IAAC</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              More than just a campus. It's a community where professional standards meet creative freedom. Join us to grow, lead, and excel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: WHO WE ARE (Intro) --- */}
      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ 
          hidden: { opacity: 0, y: 30 }, 
          visible: { opacity: 1, y: 0, transition: { ...fastTransition } } 
        }}
      >
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
            Since 2015
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
            International Airline and Aviation College
          </h2>
          
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left md:text-center">
            <p>
              IAAC is a private educational institute based in Sri Lanka which commenced academic programs in October 2015. 
              Strategically located in the heart of Colombo city, we are in close proximity to 12 Leading National schools, catering to about 20,000 potential students.
            </p>
            <p>
              We are a training center authorized and monitored by the <strong>Tertiary and Vocational Education Commission (TVEC)</strong> of Sri Lanka (under the Ministry of Skills Development) to provide vocational training in Airline and Aviation studies.
            </p>
            <p>
              At present, we have enrolled foreign students from India, Maldives, and the Philippines in our training programs.
            </p>
          </div>

          {/* Award Badge - Centered */}
          <div className="mt-12 inline-flex flex-col md:flex-row items-center gap-4 bg-amber-50 border border-amber-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600 shrink-0">
              <Award size={32} />
            </div>
            <div className="text-center md:text-left">
              <p className="font-bold text-slate-800 text-lg">Award Winner 2020-2021</p>
              <p className="text-sm text-slate-600">
                Recipient of the “Best Airline Training College” in Sri Lanka Award twice.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- SECTION 3: MISSION & VISION --- */}
      <motion.section
        className="py-16 bg-slate-50"
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
            className="bg-[#1e3a8a] text-white p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-blue-900/20 group h-full"
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
            className="bg-blue-600 text-white p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-blue-600/20 group h-full"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: fastTransition } }}
            whileHover={{ y: -5 }}
          >
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
             <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
               <Target className="text-blue-200 w-8 h-8" />
               Our Mission
             </h3>
             <p className="text-blue-50 leading-relaxed text-lg">
               To nurture and transform competent raw students into confident and potential candidates to take up challenging careers in the aviation industry by providing quality education.
             </p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- SECTION 4: OBJECTIVES --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900">Our Objectives</h2>
              <p className="mt-4 text-slate-600">Providing a clear academic pathway for the next generation.</p>
            </motion.div>

            <div className="space-y-8">
              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex gap-6 hover:bg-slate-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full h-fit">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">Creating Academic Pathways</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Our initial research showed no clear academic pathway for school leavers to access lucrative opportunities in the fast-growing Airline industry. We exist to bridge that gap.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex gap-6 hover:bg-slate-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full h-fit">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">Career Guidance & Placement</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Since 2015, our primary objective has been to provide in-house training and necessary support to unemployed youth so they can secure job placements with leading Airlines, Leisure Agents, and Freight Forwarders.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex gap-6 hover:bg-slate-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full h-fit">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">Commitment to Excellence</h4>
                  <p className="text-slate-600 leading-relaxed">
                    We utilize both traditional and innovative teaching methods to help students achieve their greatest academic, personal, and professional potential at an affordable price.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: FACULTY --- */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900">IAAC Academic Faculty</h2>
            <p className="mt-4 text-slate-600">
              Our faculty consists of hand-picked qualified professionals with extensive industry exposure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <FacultyItem 
              role="CEO / Chairman" 
              desc="A qualified professor with over 30 years of experience in the higher education field." 
            />
            <FacultyItem 
              role="Head of Training" 
              desc="Over 40 years of experience in the Aviation industry, with 25 years in senior management positions." 
            />
            <FacultyItem 
              role="Course Coordinators" 
              desc="All coordinators possess over 25 years of hands-on experience in the aviation industry." 
            />
            <FacultyItem 
              role="Academic Faculty" 
              desc="Includes well-experienced, knowledgeable working professionals from relevant industries delivering quality training." 
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 6: QMS & QUALITY POLICY --- */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-blue-400 w-8 h-8" />
              <h3 className="text-2xl font-bold">Quality Management System (QMS)</h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              IAAC maintains the necessary records to comply with the TVEC QMS standard. This system ensures that IAAC has the capability to establish and maintain an environment fit for delivering education and training to the specified standard and ensure continuous improvement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800 p-8 rounded-2xl border border-slate-700"
          >
            <h4 className="text-xl font-bold text-blue-400 mb-4">Quality Policy of IAAC</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              "The college is committed to communicating with its students, faculty, staff members, and all other interested parties in order to continually improve its services, products, processes, methods and the work environment, to ensure each student is receiving the highest quality service in compliance with existing statutory and other regulatory requirements, at the committed cost and on time."
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// --- HELPER COMPONENT ---
function FacultyItem({ role, desc }) {
  return (
    <motion.div
      className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-lg">{role}</h4>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default About;