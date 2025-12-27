import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Users, Presentation, Compass, CheckCircle2 } from 'lucide-react';

// TIP: If using Vite/Webpack, you might want to import the image at the top like:
// import dressCodeImg from '../assets/dresscode.jpg';

function StudentLife() {
  return (
    <>
      {/* --- HERO HEADER --- */}
      <motion.section
        id="student-life"
        className="bg-slate-900 pt-[160px] pb-16 px-6 scroll-mt-[140px]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 32 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 0.84, 0.44, 1], when: 'beforeChildren', staggerChildren: 0.12 }
          }
        }}
      >
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
          >
            Student <span className="text-blue-500">Life</span>
          </motion.h1>
          <motion.p
            className="text-slate-400 max-w-2xl mx-auto text-lg"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.05 } } }}
          >
            Experience a vibrant community focused on professional growth, teamwork, and leadership excellence at IAAC.
          </motion.p>
        </div>
      </motion.section>

      {/* --- DRESS CODE & ORIENTATION GRID --- */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.15 } } }}
      >
        {/* items-stretch ensures both cards have the same height */}
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-stretch">

          {/* Dress Code Card (UPDATED WITH FIX) */}
          <motion.div
            className="bg-slate-50 border border-slate-100 rounded-3xl p-8 relative overflow-hidden group h-full"
            variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] } } }}
            whileHover={{ y: -10, boxShadow: '0px 25px 45px -25px rgba(15, 23, 42, 0.35)' }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            {/* Background Icon Effect */}
            <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 group-hover:scale-110 transition-transform pointer-events-none">
              <Shirt size={120} strokeWidth={1} />
            </div>

            {/* UPDATED CONTAINER:
               Added 'justify-between'. This ensures the text block is at the top, 
               the image is at the bottom, and any extra space (if the blue card happens to be taller) 
               is placed between them.
            */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* Top Content Block */}
              <div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-6">
                  <Shirt size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Dress Code</h2>
                <p className="text-slate-600 mb-6">
                  All IAAC students are expected to maintain a professional appearance during lectures.
                </p>

                <ul className="space-y-3 mb-8">
                  <ListItem text="White short sleeves shirt with IAAC Logo" />
                  <ListItem text="Black formal pants" />
                  <ListItem text="Black formal shoes" />
                </ul>
              </div>

              {/* --- IMAGE FIX HERE --- */}
              {/* 1. Removed 'flex-1', 'relative', 'min-h'. It's just a wrapper now.
                  2. Added 'mt-4' for spacing from the text.
              */}
              <div className="mt-4 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                {/*
                   3. CHANGED IMAGE STYLES:
                   - Removed 'absolute inset-0 h-full'.
                   - Changed to 'w-full h-auto'. This allows the image to show fully without cropping, maintaining its aspect ratio.
                */}
                <img
                  src="/hero3.png"
                  alt="Student Dress Code Example"
                  className="w-full h-auto object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

            </div>
          </motion.div>

          {/* Orientation Card (The "Blue Card") */}
          <motion.div
            // h-full ensures it stretches to match the neighbor
            className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group h-full"
            variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: 0.05 } } }}
            whileHover={{ y: -10, boxShadow: '0px 25px 50px -20px rgba(37, 99, 235, 0.55)' }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
             <div className="absolute bottom-0 right-0 p-8 opacity-10 text-white group-hover:scale-110 transition-transform">
              <Compass size={120} strokeWidth={1} />
            </div>

            {/* Added justify-between here too for balance, though not strictly necessary if content is short */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-500/50 rounded-xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                  <Compass size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Orientation Program</h2>
                <div className="space-y-4 text-blue-100 leading-relaxed">
                  <p>
                    Held before the first classroom sessions commence, our orientation is the ideal networking opportunity for new recruits.
                  </p>
                  <p>
                    It serves as a warm welcome for freshers to get to know each other, meet our faculty, and learn more about the College culture.
                  </p>
                </div>
              </div>
               {/* Optional footer content to balance height if needed */}
               <div className="mt-8 pt-6 border-t border-blue-500/30">
                  <p className="font-semibold">Get ready to start your journey.</p>
               </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* --- ACADEMIC ACTIVITIES --- */}
      <motion.section
        className="py-20 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.2 } } }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Group Presentation */}
            <motion.div
              className="flex flex-col md:flex-row gap-8 items-start"
              variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] } } }}
            >
              <div className="shrink-0 p-4 bg-white rounded-2xl shadow-sm text-purple-600">
                <Presentation size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Group Presentations</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  These sessions are an ideal opportunity for students to brush up on individual presentation skills and learn to be productive group members.
                </p>
                <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-xl border border-slate-200 text-sm">
                  <strong className="text-slate-900 block mb-2">Classroom Session Focus:</strong>
                  Conducted under the supervision of course coordinators, these sessions examine the student’s ability to present using Microsoft PowerPoint and relevant multimedia aids.
                </p>
              </div>
            </motion.div>

            {/* Team Building */}
            <motion.div
              className="flex flex-col md:flex-row gap-8 items-start"
              variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: 0.05 } } }}
            >
              <div className="shrink-0 p-4 bg-white rounded-2xl shadow-sm text-orange-500">
                <Users size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Team Building & Leadership</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  "Coming together is a beginning. Keeping together is progress. Working together is a success."
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h4 className="font-bold text-slate-900 mb-2">Teamwork</h4>
                    <p className="text-sm text-slate-500">The ability to work together toward a common vision.</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <h4 className="font-bold text-slate-900 mb-2">Leadership</h4>
                    <p className="text-sm text-slate-500">A great leader takes people where they don't necessarily want to go, but ought to be.</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>
    </>
  );
}

// Helper Component for list items
function ListItem({ text }) {
  return (
    <motion.li
      className="flex items-center gap-3"
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
    >
      <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
      <span className="text-slate-700 font-medium">{text}</span>
    </motion.li>
  );
}

export default StudentLife;