import React, { useState } from 'react';
import apiClient from '../services/apiClient.js';
import { 
  User, MapPin, Phone, Mail, BookOpen, CheckCircle2, 
  ChevronRight, ChevronLeft, Send, GraduationCap, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ApplyNow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  // --- FORM STATE ---
  const [form, setForm] = useState({
    // Step 1: Personal
    title: 'Mr',
    fullName: '',
    nic: '',
    dob: '',
    gender: 'Male',
    address: '',
    mobile: '',
    whatsapp: '',
    email: '',
    
    // Step 2: Education & Parent
    school: '',
    olYear: '',
    olResults: { math: '', english: '', science: '', history: '', religion: '', language: '' },
    parentName: '',
    parentPhone: '',

    // Step 3: Course & Terms
    course: '',
    academy: '',
    referral: '',
    agreed: false
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const updateNested = (category, field) => (e) => setForm({ 
    ...form, 
    [category]: { ...form[category], [field]: e.target.value } 
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const submit = async () => {
    if (!form.agreed) {
      setStatus({ submitting: false, success: false, error: 'Please agree to the terms.' });
      return;
    }
    if (!form.academy) {
      setStatus({ submitting: false, success: false, error: 'Please select the academy/campus.' });
      return;
    }
    setStatus({ submitting: true, success: false, error: '' });
    try {
<<<<<<< HEAD
      const res = await apiClient.post('/api/applications', form);
      // Defensive: treat any 2xx as success
      if (!res || (res.status < 200 || res.status >= 300)) {
        throw new Error('Unexpected response from server');
      }
=======
      const fullName = (form.fullName || '').trim();
      const parts = fullName.split(/\s+/).filter(Boolean);
      const firstName = parts[0] || '-';
      const lastName = parts.slice(1).join(' ') || '-';

      const payload = {
        firstName,
        lastName,
        dob: form.dob || undefined,
        nic: form.nic || undefined,
        gender: form.gender || undefined,
        email: form.email,
        phone: form.mobile,
        whatsapp: form.whatsapp || undefined,
        address: form.address || undefined,
        program: form.course,
        academy: form.academy,
      };

      await apiClient.post('/api/applications', payload);
>>>>>>> 05ab208bb4facf583eb27c1e331e1e7b0773a955
      setStatus({ submitting: false, success: true, error: '' });
    } catch (err) {
<<<<<<< HEAD
      const serverMessage = err?.response?.data?.message;
      const networkMessage = err?.message;
      setStatus({ submitting: false, success: false, error: serverMessage || networkMessage || 'Failed to submit application' });
=======
      setStatus({ submitting: false, success: false, error: 'Submission failed. Please try again.' });
>>>>>>> 05ab208bb4facf583eb27c1e331e1e7b0773a955
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- HERO HEADER --- */}
      <section className="bg-[#0f172a] pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Student Application
          </h1>
          <p className="text-slate-400 text-lg">
            Start your journey with IAAC. Please fill in the details below.
          </p>
        </div>
      </section>

      {/* --- MAIN FORM CONTAINER --- */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* PROGRESS BAR */}
          <div className="bg-slate-50 border-b border-slate-100 p-6 md:p-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {/* Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 rounded-full"></div>
              
              {/* Line Fill */}
              <motion.div 
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                transition={{ duration: 0.5 }}
              />

              {/* Step 1 Bubble */}
              <StepBubble step={1} current={currentStep} label="Personal" icon={User} />
              {/* Step 2 Bubble */}
              <StepBubble step={2} current={currentStep} label="Education" icon={GraduationCap} />
              {/* Step 3 Bubble */}
              <StepBubble step={3} current={currentStep} label="Finish" icon={CheckCircle2} />
            </div>
          </div>

          {/* FORM CONTENT AREA */}
          <div className="p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode='wait'>
              
              {/* --- STEP 1: PERSONAL INFO --- */}
              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 max-w-3xl mx-auto"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-4 gap-5">
                    <div className="md:col-span-1">
                      <Label text="Title" />
                      <select value={form.title} onChange={update('title')} className="input-field">
                        <option>Mr</option><option>Ms</option><option>Mrs</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <Label text="Full Name" />
                      <input type="text" placeholder="Your Full Name" value={form.fullName} onChange={update('fullName')} className="input-field" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label text="NIC / Passport" />
                      <input type="text" placeholder="Identity Number" value={form.nic} onChange={update('nic')} className="input-field" />
                    </div>
                    <div>
                      <Label text="Date of Birth" />
                      <input type="date" value={form.dob} onChange={update('dob')} className="input-field" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label text="Mobile Number" />
                      <input type="tel" placeholder="077 123 4567" value={form.mobile} onChange={update('mobile')} className="input-field" />
                    </div>
                    <div>
                      <Label text="Email Address" />
                      <input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} className="input-field" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label text="WhatsApp Number" />
                      <input type="tel" placeholder="077 123 4567" value={form.whatsapp} onChange={update('whatsapp')} className="input-field" />
                    </div>
                    <div />
                  </div>

                  <div>
                    <Label text="Home Address" />
                    <textarea rows="2" placeholder="Your permanent address" value={form.address} onChange={update('address')} className="input-field"></textarea>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 2: EDUCATION & PARENT --- */}
              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 max-w-3xl mx-auto"
                >
                  {/* Education Section */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <GraduationCap className="text-blue-600" size={24}/> Educational Background
                    </h3>
                    <div className="grid md:grid-cols-3 gap-5 mb-5">
                      <div className="md:col-span-2">
                        <Label text="School Attended" />
                        <input type="text" placeholder="School Name" value={form.school} onChange={update('school')} className="input-field" />
                      </div>
                      <div>
                        <Label text="O/L Year" />
                        <input type="text" placeholder="2023" value={form.olYear} onChange={update('olYear')} className="input-field" />
                      </div>
                    </div>

                    {/* O/L Grid */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">G.C.E O/L Results</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <ResultSelect subject="Mathematics" value={form.olResults.math} onChange={updateNested('olResults', 'math')} />
                        <ResultSelect subject="English" value={form.olResults.english} onChange={updateNested('olResults', 'english')} />
                        <ResultSelect subject="Science" value={form.olResults.science} onChange={updateNested('olResults', 'science')} />
                        <ResultSelect subject="History" value={form.olResults.history} onChange={updateNested('olResults', 'history')} />
                        <ResultSelect subject="Religion" value={form.olResults.religion} onChange={updateNested('olResults', 'religion')} />
                        <ResultSelect subject="Language" value={form.olResults.language} onChange={updateNested('olResults', 'language')} />
                      </div>
                    </div>
                  </div>

                  {/* Parent Section */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <User className="text-blue-600" size={24}/> Parent / Guardian
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label text="Guardian Name" />
                        <input type="text" placeholder="Parent's Name" value={form.parentName} onChange={update('parentName')} className="input-field" />
                      </div>
                      <div>
                        <Label text="Contact Number" />
                        <input type="tel" placeholder="Parent's Mobile" value={form.parentPhone} onChange={update('parentPhone')} className="input-field" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 3: COURSE & FINISH --- */}
              {currentStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 max-w-3xl mx-auto"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Select Your Course</h3>

                    <div className="mb-6">
                      <Label text="Select Academy / Campus" />
                      <select value={form.academy} onChange={update('academy')} className="input-field">
                        <option value="">Select</option>
                        <option value="IAAC City Campus">IAAC City Campus</option>
                        <option value="Airport Academy">Airport Academy</option>
                        <option value="Kurunegala Center">Kurunegala Center</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        'Diploma in Airline Cabin Crew',
                        'Diploma in Airport Ground Ops',
                        'Diploma in Ticketing & Reservations',
                        'Diploma in Air Cargo & Logistics',
                      ].map((c) => (
                        <CourseCard 
                          key={c} 
                          label={c} 
                          selected={form.course === c} 
                          onClick={() => setForm({...form, course: c})} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({...form, agreed: e.target.checked})} className="peer sr-only" />
                        <div className="w-6 h-6 border-2 border-slate-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                        <CheckCircle2 size={16} className="absolute text-white opacity-0 peer-checked:opacity-100 left-1 top-1 transition-all" />
                      </div>
                      <div className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                        <span className="font-bold block mb-1">Declaration</span>
                        I certify that the information provided is true and correct.
                      </div>
                    </label>
                  </div>

                  {status.success && (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-bold border border-green-200">
                      🎉 Application Submitted Successfully! We will contact you soon.
                    </motion.div>
                  )}
                  {status.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm border border-red-200">
                      {status.error}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            {currentStep > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors px-4 py-2">
                <ChevronLeft size={20} /> Back
              </button>
            ) : (
              <div></div> // Spacer
            )}

            {currentStep < 3 ? (
              <button onClick={nextStep} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2">
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={submit} 
                disabled={status.submitting || status.success}
                className={`px-10 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2
                  ${status.success ? 'bg-green-600 text-white cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30'}
                  ${status.submitting ? 'opacity-70 cursor-wait' : ''}
                `}
              >
                {status.submitting ? 'Sending...' : status.success ? 'Sent' : 'Submit Application'} 
                {!status.success && <Send size={20} />}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function Label({ text }) {
  return <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{text}</label>;
}

function StepBubble({ step, current, label, icon: Icon }) {
  const active = step === current;
  const completed = step < current;
  
  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2
        ${active ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-200' : 
          completed ? 'bg-blue-600 border-blue-600 text-white' : 
          'bg-white border-slate-200 text-slate-300'}
      `}>
        {completed ? <CheckCircle2 size={20} /> : <Icon size={18} />}
      </div>
      <span className={`text-xs font-bold transition-colors duration-300 ${active || completed ? 'text-slate-800' : 'text-slate-300'}`}>
        {label}
      </span>
    </div>
  );
}

function ResultSelect({ subject, value, onChange }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{subject}</label>
      <select 
        value={value} 
        onChange={onChange} 
        className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
      >
        <option value="">Grade</option>
        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="S">S</option><option value="W">W</option>
      </select>
    </div>
  );
}

function CourseCard({ label, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden
      ${selected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100 bg-white hover:border-blue-200'}`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-blue-600' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
      </div>
      <span className={`font-bold text-sm ${selected ? 'text-blue-800' : 'text-slate-600'}`}>{label}</span>
    </div>
  );
}

// Global CSS via style tag for inputs (keeps JSX clean)
const styles = `
  .input-field {
    width: 100%;
    padding: 12px 16px;
    background-color: #f8fafc; /* slate-50 */
    border: 1px solid #e2e8f0; /* slate-200 */
    border-radius: 12px;
    color: #1e293b; /* slate-800 */
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
  }
  .input-field:focus {
    border-color: #3b82f6; /* blue-500 */
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

export default function ApplyNowWithStyles() {
  return (
    <>
      <style>{styles}</style>
      <ApplyNow />
    </>
  );
}