import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Users, Presentation, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

function StudentLife() {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-900 pt-32 sm:pt-[180px] pb-24 px-6 overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-80 h-80 sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] bg-blue-600/20 rounded-full blur-[80px] sm:blur-[90px] lg:blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
              Life at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">IAAC</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
              More than just a campus. It's a community where professional standards meet creative freedom. Join us to grow, lead, and excel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 1: DRESS CODE (Split Layout) --- */}
      {/* This layout solves the image size issue by giving the image its own full column */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Left Column: Content */}
              <motion.div 
                className="p-6 md:p-12 order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                    <Shirt size={28} strokeWidth={1.5} />
                  </div>
                  <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Professional Standards</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Dress for Success</h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  We believe professionalism starts with appearance. Our dress code is designed to prepare you for the corporate world from day one.
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Standard Uniform
                  </h3>
                  <ul className="space-y-4">
                    <ListItem text="White short sleeves shirt with IAAC Logo" />
                    <ListItem text="Black formal pants (No denim)" />
                    <ListItem text="Black polished formal shoes" />
                  </ul>
                </div>
              </motion.div>

              {/* Right Column: Image */}
              {/* Now the image can be as tall as it needs to be! */}
              <motion.div 
                className="relative h-[400px] lg:h-[600px] w-full rounded-[2rem] overflow-hidden order-1 lg:order-2 group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <img 
                  src="/hero3.png" 
                  alt="Students in uniform" 
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                  <p className="font-medium text-lg">"Excellence is not an act, but a habit."</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: ORIENTATION (Wide Banner) --- */}
      <section className="px-6 pb-24">
        <div className="container mx-auto">
          <motion.div 
            className="bg-blue-600 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-500/50 backdrop-blur-sm py-2 px-4 rounded-full border border-blue-400/30 mb-8">
                <Compass size={18} />
                <span className="text-sm font-medium">New Student Journey</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Orientation Program</h2>
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8">
                Your first step into college life. Connect with faculty, meet your future batchmates, and immerse yourself in the IAAC culture before classes even begin.
              </p>
              
              <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                View Schedule <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: SKILL BUILDING (Grid) --- */}
      <section className="px-6 pb-32">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Beyond the Classroom</h2>
              <p className="text-slate-500">Developing the soft skills that define great leaders.</p>
            </div>
            <div className="h-px bg-slate-200 flex-1 ml-8 hidden md:block" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <ActivityCard 
              icon={<Presentation size={32} />}
              title="Public Speaking"
              desc="Master the art of presentation. Learn to communicate complex ideas effectively using modern tools."
              color="text-purple-600"
              bg="bg-purple-50"
            />

            {/* Card 2 */}
            <ActivityCard 
              icon={<Users size={32} />}
              title="Teamwork"
              desc="Collaborate on real-world projects. Understand group dynamics and how to drive collective success."
              color="text-orange-500"
              bg="bg-orange-50"
            />

            {/* Card 3 */}
            <ActivityCard 
              icon={<div className="font-bold text-2xl">L</div>} // Custom icon or use another lucide one
              title="Leadership"
              desc="Step up and take charge. Our programs are designed to identify and nurture future industry leaders."
              color="text-blue-600"
              bg="bg-blue-50"
            />

          </div>
        </div>
      </section>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function ListItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
      <span className="text-slate-700 font-medium">{text}</span>
    </li>
  );
}

function ActivityCard({ icon, title, desc, color, bg }) {
  return (
    <motion.div 
      className="bg-white p-8 rounded-[2rem] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

export default StudentLife;