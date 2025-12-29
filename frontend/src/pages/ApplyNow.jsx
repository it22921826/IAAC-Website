import React, { useState } from 'react';
import apiClient from '../services/apiClient.js';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  Send,
  Calendar
} from 'lucide-react';

function ApplyNow() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    nic: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    program: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (!form.nic.trim()) newErrors.nic = 'NIC / Passport number is required';
    if (!form.gender) newErrors.gender = 'Please select your gender';

    if (!form.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';

    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Home address is required';

    if (!form.program) newErrors.program = 'Please select a program';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const submit = async () => {
    if (!validate()) {
      setStatus({ submitting: false, success: false, error: 'Please fix the highlighted fields.' });
      return;
    }
    setStatus({ submitting: true, success: false, error: '' });
    try {
      await apiClient.post('/api/applications', form);
      setStatus({ submitting: false, success: true, error: '' });
      setForm({ firstName: '', lastName: '', dob: '', nic: '', gender: '', email: '', phone: '', address: '', program: '' });
      setErrors({});
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err?.response?.data?.message || 'Failed to submit application' });
    }
  };
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-32 pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Apply for <span className="text-blue-500">2025 Intake</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Take the first step towards your career in aviation. Fill out the form below to start your admission process.
          </p>
        </div>
      </section>

      {/* --- APPLICATION CONTENT --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">

          {/* --- LEFT COLUMN: FORM --- */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Online Application Form</h2>
                  <p className="text-slate-500 text-sm">Please fill in all required fields accurately.</p>
                </div>
              </div>

              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                
                {/* 1. Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User size={18} className="text-blue-500" /> Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="First Name" placeholder="Sanuthi" value={form.firstName} onChange={update('firstName')} error={errors.firstName} />
                    <InputField label="Last Name" placeholder="Ranaweera" value={form.lastName} onChange={update('lastName')} error={errors.lastName} />
                    <InputField label="Date of Birth" type="date" value={form.dob} onChange={update('dob')} error={errors.dob} />
                    <InputField label="NIC / Passport Number" placeholder="123456789V" value={form.nic} onChange={update('nic')} error={errors.nic} />
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                      <div className="flex gap-6 mt-2">
                        <RadioOption name="gender" label="Male" checked={form.gender==='Male'} onChange={() => setForm((f)=>({...f, gender:'Male'}))} />
                        <RadioOption name="gender" label="Female" checked={form.gender==='Female'} onChange={() => setForm((f)=>({...f, gender:'Female'}))} />
                      </div>
                      {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                    </div>
                  </div>
                </div>

                {/* 2. Contact Details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-500" /> Contact Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Email Address" type="email" placeholder="student@example.com" icon={Mail} value={form.email} onChange={update('email')} error={errors.email} />
                    <InputField label="Phone Number" type="tel" placeholder="071 234 5678" icon={Phone} value={form.phone} onChange={update('phone')} error={errors.phone} />
                    <div className="md:col-span-2">
                      <InputField label="Home Address" placeholder="No. 123, Street Name, City" value={form.address} onChange={update('address')} error={errors.address} />
                    </div>
                  </div>
                </div>

                {/* 3. Course Selection */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-500" /> Course Interest
                  </h3>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Program</label>
                    <select value={form.program} onChange={update('program')} className={`w-full px-4 py-3 rounded-lg bg-slate-50 border ${errors.program ? 'border-red-500' : 'border-slate-200'} focus:border-blue-500 outline-none transition-all appearance-none`}>
                      <option value="" disabled>Choose a course...</option>
                      <option value="cabin-crew">Diploma in Airline Cabin Crew</option>
                      <option value="ground-ops">Diploma in Airport Ground Operations</option>
                      <option value="ticketing">Diploma in Ticketing & Reservations</option>
                      <option value="cargo">Diploma in Air Cargo & Logistics</option>
                      <option value="pilot-ppl">Pilot Training - PPL</option>
                      <option value="pilot-cpl">Pilot Training - CPL/IR</option>
                    </select>
                    {errors.program && <p className="mt-1 text-xs text-red-600">{errors.program}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-100">
                  {status.error && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">{status.error}</div>
                  )}
                  {status.success && (
                    <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-3 py-2">Application submitted successfully.</div>
                  )}
                  <button type="submit" disabled={status.submitting} className="w-full py-4 bg-blue-600 disabled:opacity-60 text-white font-bold text-lg rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                    {status.submitting ? 'Submitting...' : 'Submit Application'}
                    <Send size={20} />
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

              </form>
            </div>
          </div>

          {/* --- RIGHT COLUMN: INFO & STEPS --- */}
          <div className="space-y-8">
            
            {/* Admission Steps */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Admission Steps</h3>
              <div className="space-y-6">
                <StepItem number="1" title="Submit Application" desc="Fill out this online form with accurate details." />
                <StepItem number="2" title="Counselor Call" desc="Our admissions team will contact you for a brief discussion." />
                <StepItem number="3" title="Interview" desc="Attend a friendly interview to assess your aptitude." />
                <StepItem number="4" title="Enrollment" desc="Pay the registration fee and start your journey!" />
              </div>
            </div>

            {/* Requirements Box */}
            <div className="bg-blue-600 text-white p-8 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
               
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <CheckCircle2 size={20} /> Requirements
               </h3>
               <ul className="space-y-3 text-blue-50 text-sm">
                 <li className="flex gap-3 items-start">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></span>
                   <span>Minimum of 6 Passes in G.C.E O/L (including English & Math)</span>
                 </li>
                 <li className="flex gap-3 items-start">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></span>
                   <span>Age between 17 - 28 years</span>
                 </li>
                 <li className="flex gap-3 items-start">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></span>
                   <span>Good command of English</span>
                 </li>
                 <li className="flex gap-3 items-start">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></span>
                   <span>Pleasing personality & grooming</span>
                 </li>
               </ul>
            </div>

            {/* Help Contact */}
            <div className="text-center p-6">
              <p className="text-slate-500 text-sm mb-2">Need help applying?</p>
              <a href="tel:0766763777" className="text-blue-600 font-bold hover:underline">
                Call Admissions: 076 676 3777
              </a>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

// --- Helper Components ---

function InputField({ label, type = "text", placeholder, icon: Icon, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${Icon ? 'pl-10' : ''}`}
        />
        {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function RadioOption({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-slate-700">{label}</span>
    </label>
  );
}

function StepItem({ number, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default ApplyNow;