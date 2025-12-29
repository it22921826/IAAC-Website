import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Mail, 
  User, 
  FileText, 
  CheckCircle2, 
  Send,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

function CareerSupport() {
  const [cvFile, setCvFile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setStatus({ submitting: false, success: false, error: 'Please enter your email.' });
      return;
    }
    setStatus({ submitting: true, success: false, error: '' });
    try {
      await apiClient.post('/api/messages', {
        fullName: form.name,
        email: form.email,
        message: form.message,
        source: 'career-support',
      });
      setStatus({ submitting: false, success: true, error: '' });
      setForm({ name: '', email: '', message: '' });
      setCvFile(null);
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err?.response?.data?.message || 'Failed to send inquiry',
      });
    }
  };

  return (
    <>
      {/* --- HERO SECTION --- */}
      <motion.section
        className="bg-slate-900 pt-[160px] pb-16 px-6"
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
            Internships & <span className="text-blue-500">Career Support</span>
          </motion.h1>
          <motion.p
            className="text-slate-400 max-w-2xl mx-auto text-lg"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.05 } } }}
          >
            Bridging the gap between academic excellence and professional success in the aviation industry.
          </motion.p>
        </div>
      </motion.section>

      {/* --- INTERNSHIP INFO SECTION --- */}
      <motion.section
        id="internships"
        className="py-20 bg-white scroll-mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.15 } } }}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <motion.div className="space-y-8" variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.12 } } }}>
              <div>
                <motion.div className="flex items-center gap-3 mb-4" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Briefcase size={28} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Internships & Job Vacancies</h2>
                </motion.div>
                <motion.p className="text-slate-600 leading-relaxed mb-6" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                  Industry-related internships are on offer for our best performers—students who have scored high marks in theory evaluations and excelled in the interview-ready program.
                </motion.p>
                
                <motion.div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                  <p className="text-sm text-slate-700 italic">
                    "Please note that placements are at the discretion of the Management and Faculty, subject to industry availability. However, every effort is made to offer placements to successful candidates."
                  </p>
                </motion.div>
              </div>

              <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.05 } } }}>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Our Commitment</h3>
                <motion.ul className="space-y-3" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                  <ListItem text="Exclusive access to the IAAC CV Bank" />
                  <ListItem text="Direct connections with leading airlines & agents" />
                  <ListItem text="Priority for high-performing graduates" />
                </motion.ul>
              </motion.div>
            </motion.div>

            {/* Right: Feature Card */}
            <motion.div
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-lg"
              variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] } } }}
              whileHover={{ y: -12, boxShadow: '0px 28px 55px -35px rgba(15, 23, 42, 0.45)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Career Guidance</h3>
                  <p className="text-slate-500 text-sm">Personalized Counseling</p>
                </div>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">
                For personalized career support, guidance, and counseling, students are encouraged to meet with our dedicated counselor.
              </p>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <User className="shrink-0 text-blue-600 mt-1" size={24} />
                <div>
                  <p className="font-bold text-slate-900">Mr. Ramzeen Azeez</p>
                  <p className="text-sm text-slate-500 mb-2">Career Counselor</p>
                  <p className="text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                    Available Weekdays (By Appointment)
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* --- CV SUBMISSION & FORM SECTION --- */}
      <motion.section
        id="submit-cv"
        className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.15 } } }}
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
          
          {/* Instructions */}
          <motion.div variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.12 } } }}>
            <motion.h2 className="text-3xl font-bold text-slate-900 mb-6" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
              Submit Your CV
            </motion.h2>
            <motion.p className="text-slate-600 leading-relaxed mb-8" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.05 } } }}>
              All students completing any course offered by IAAC are advised to submit their latest CV to our database.
            </motion.p>

            <motion.div className="space-y-6" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div className="flex gap-4" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Prepare Your Documents</h4>
                  <p className="text-sm text-slate-600 mt-1">Ensure your CV is updated. Include a cover letter disclosing your commitment and any special interests.</p>
                </div>
              </motion.div>

              <motion.div className="flex gap-4" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.05 } } }}>
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us Directly</h4>
                  <p className="text-sm text-slate-600 mt-1">Send your documents to <a href="mailto:careers@iaacasia.com" className="text-blue-600 font-bold hover:underline">careers@iaacasia.com</a></p>
                </div>
              </motion.div>

              <motion.div className="flex gap-4" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 } } }}>
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Check Notice Boards</h4>
                  <p className="text-sm text-slate-600 mt-1">Periodically check our physical and digital notice boards for new vacancy publications.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] } } }}
            whileHover={{ y: -10, boxShadow: '0px 30px 60px -35px rgba(15, 23, 42, 0.45)' }}
            transition={{ type: 'spring', stiffness: 210, damping: 22 }}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Mail className="text-blue-600" size={20} />
              Quick Inquiry
            </h3>
            
            <form className="space-y-4" onSubmit={submit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Sanuthi Ranaweera"
                  value={form.name}
                  onChange={update('name')}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  rows="4"
                  placeholder="I am interested in internship opportunities..."
                  value={form.message}
                  onChange={update('message')}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  Upload CV (optional)
                </label>
                <label className="block cursor-pointer">
                  <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 transition-all">
                    <span className="text-sm text-slate-600 truncate">
                      {cvFile ? cvFile.name : 'Choose file (PDF, DOC, DOCX)'}
                    </span>
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white">
                      Browse
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      setCvFile(file || null);
                    }}
                  />
                </label>
                <p className="mt-1 text-xs text-slate-500">Max size 5MB. PDF format is preferred.</p>
              </div>

              {status.error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                  {status.error}
                </div>
              )}
              {status.success && (
                <div className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
                  Inquiry sent successfully.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status.submitting}
                className="w-full py-3 bg-blue-600 disabled:opacity-60 text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:brightness-110 flex items-center justify-center gap-2"
              >
                {status.submitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </motion.section>
    </>
  );
}

// --- Helper Component ---
function ListItem({ text }) {
  return (
    <motion.li
      className="flex items-center gap-3 text-slate-700"
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
    >
      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
      <span className="text-sm font-medium">{text}</span>
    </motion.li>
  );
}

export default CareerSupport;