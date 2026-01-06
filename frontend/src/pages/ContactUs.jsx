import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import apiClient from '../services/apiClient.js';

function ContactUs() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
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
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        source: 'contact',
      });
      setStatus({ submitting: false, success: true, error: '' });
      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err?.response?.data?.message || 'Failed to send message',
      });
    }
  };

  return (
    <>
      {/* --- HERO SECTION (Updated to Dark Navy Brand Style) --- */}
      <section className="relative pt-32 md:pt-[160px] pb-24 bg-[#0f172a] overflow-hidden text-center px-6">
        
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Conversation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Have questions about admissions, campus life, or academics? We are here to help you find the answers you need.
          </motion.p>
        </div>
      </section>

      {/* --- MAIN CONTENT (Split Layout) --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

            {/* --- LEFT COLUMN: INFO & HOURS (Span 5) --- */}
            <motion.div 
              className="lg:col-span-5 space-y-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Info Card */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <ul className="space-y-6">
                  <ContactItem icon={<MapPin size={20} />} title="Visit Us" content={<>49A Siri Dhamma Mawatha,<br/>Colombo 01000, Sri Lanka</>} />
                  <ContactItem icon={<Phone size={20} />} title="Call Us" content={<a href="tel:0766763777" className="hover:text-blue-600">076 676 3777</a>} />
                  <ContactItem icon={<Mail size={20} />} title="Email Us" content={<a href="mailto:info@iaac.lk" className="hover:text-blue-600">info@iaac.lk</a>} />
                </ul>
              </div>

              {/* Opening Hours */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-slate-900">
                  <Clock size={20} className="text-blue-600" />
                  <h4 className="font-bold text-lg">Opening Hours</h4>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <HourItem day="Mon - Fri" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Saturday" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Sunday" hours="8:30 AM – 1:00 PM" />
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <SocialBtn
                    icon={<Facebook size={20} />}
                    href="https://www.facebook.com/iaacsl"
                    label="IAAC on Facebook"
                  />
                  <SocialBtn
                    icon={<Youtube size={20} />}
                    href="https://www.youtube.com/@internationalairlineaviati4986"
                    label="IAAC on YouTube"
                  />
                  <SocialBtn
                    icon={<Linkedin size={20} />}
                    href="https://www.linkedin.com/company/international-airline-aviation-college/posts/?feedView=all"
                    label="IAAC on LinkedIn"
                  />
                  <SocialBtn
                    icon={<Instagram size={20} />}
                    href="https://www.instagram.com/iaac_aviation/"
                    label="IAAC on Instagram"
                  />
                </div>
              </div>
            </motion.div>

            {/* --- RIGHT COLUMN: FORM (Span 7) --- */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Send a Message</h2>
                <p className="text-slate-500 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
                
                <form className="space-y-6" onSubmit={submit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="First Name" type="text" placeholder="John" value={form.firstName} onChange={update('firstName')} />
                    <InputGroup label="Last Name" type="text" placeholder="Doe" value={form.lastName} onChange={update('lastName')} />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={update('email')} />
                    <InputGroup label="Phone Number" type="tel" placeholder="+94 7X XXX XXXX" value={form.phone} onChange={update('phone')} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-600"
                      value={form.subject}
                      onChange={update('subject')}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Course Details">Course Details</option>
                      <option value="Student Support">Student Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={update('message')}
                    ></textarea>
                  </div>

                  {status.error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                      {status.error}
                    </div>
                  )}
                  {status.success && (
                    <div className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
                      Message sent successfully.
                    </div>
                  )}

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status.submitting}
                    className="w-full py-4 bg-blue-600 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {status.submitting ? 'Sending...' : 'Send Message'} <Send size={18} />
                  </motion.button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- MAP SECTION (Full Width) --- */}
      <section className="h-[400px] w-full bg-slate-200 relative grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9866635904835!2d79.87037777478297!3d6.892196693106935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a3262372579%3A0x7e584033f2427b0f!2sInternational%20Airline%20%26%20Aviation%20College!5e0!3m2!1sen!2slk!4v1709620000000!5m2!1sen!2slk" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="International Airline & Aviation College - IAAC Sri Lanka Map"
         ></iframe>
         
         <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 bg-white p-4 rounded-xl shadow-xl max-w-xs hidden md:block">
           <p className="font-bold text-slate-900 text-sm">Find us easily</p>
           <p className="text-xs text-slate-500 mt-1">View our exact location on Google Maps.</p>
           <a
             href="https://maps.app.goo.gl/YourMapLinkHere"
             target="_blank"
             rel="noreferrer"
             className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
           >
             Open in Google Maps
           </a>
         </div>
      </section>
    </>
  );
}

// --- SUBCOMPONENTS ---

function ContactItem({ icon, title, content }) {
  return (
    <li className="flex items-start gap-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
        <div className="text-slate-600 text-base leading-relaxed">{content}</div>
      </div>
    </li>
  );
}

function HourItem({ day, hours }) {
  return (
    <li className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="font-medium text-slate-700">{day}</span>
      <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded">{hours}</span>
    </li>
  );
}

function InputGroup({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400" 
      />
    </div>
  );
}

function SocialBtn({ icon, href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}

export default ContactUs;