import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

function ContactUs() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <motion.section
        className="bg-slate-900 pt-32 pb-16 px-6"
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
            Contact <span className="text-blue-500">Us</span>
          </motion.h1>
          <motion.p
            className="text-slate-400 max-w-2xl mx-auto text-lg"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.05 } } }}
          >
            Get in touch with our team for inquiries about courses, admissions, or any other information.
          </motion.p>
        </div>
      </motion.section>

      {/* --- CONTACT CONTENT SECTION --- */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.15 } } }}
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* --- LEFT COLUMN: CONTACT INFO & HOURS --- */}
            <motion.div className="space-y-12" variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.12 } } }}>
              
              {/* Contact Details Card */}
              <motion.div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100" variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Get In Touch</h2>
                <motion.ul className="space-y-6" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                  
                  {/* Address */}
                  <motion.li className="flex items-start gap-4" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}>
                    <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Visit Us</h3>
                      <p className="text-slate-600 leading-relaxed">
                        49A Siri Dhamma Mawatha,<br />
                        Colombo 01000,<br />
                        Sri Lanka
                      </p>
                    </div>
                  </motion.li>

                  {/* Phone */}
                  <motion.li className="flex items-start gap-4" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.05 } } }}>
                    <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                      <p className="text-slate-600 leading-relaxed">
                        <a href="tel:0766763777" className="hover:text-blue-600 transition-colors">
                          076 676 3777
                        </a>
                      </p>
                    </div>
                  </motion.li>

                  {/* Email (Added for completeness) */}
                  <motion.li className="flex items-start gap-4" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 } } }}>
                    <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                      <p className="text-slate-600 leading-relaxed">
                        <a href="mailto:info@iaac.lk" className="hover:text-blue-600 transition-colors">
                          info@iaac.lk
                        </a>
                      </p>
                    </div>
                  </motion.li>
                </motion.ul>
              </motion.div>

              {/* Opening Hours Card */}
              <motion.div className="bg-white p-8 rounded-3xl shadow-lg shadow-blue-100/50 border border-blue-50" variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.08 } } }}>
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-slate-900">Opening Hours</h2>
                </div>
                <ul className="space-y-3 text-sm">
                  <HourItem day="Monday" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Tuesday" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Wednesday" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Thursday" hours="8:30 AM – 5:00 PM" note="(Hours might differ on holidays)" />
                  <HourItem day="Friday" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Saturday" hours="8:30 AM – 5:00 PM" />
                  <HourItem day="Sunday" hours="8:30 AM – 5:00 PM" />
                </ul>
              </motion.div>

            </motion.div>

            {/* --- RIGHT COLUMN: MAP & CONTACT FORM --- */}
            <motion.div className="space-y-12" variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delayChildren: 0.1, staggerChildren: 0.12 } } }}>
              
              {/* Google Map Embed */}
              <motion.div className="w-full h-80 bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.733102342789!2d79.8685393757562!3d6.922476393077116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593c88232123%3A0x443320626246507!2s49%20A%20Siri%20Dhamma%20Mawatha%2C%20Colombo%2001000!5e0!3m2!1sen!2slk!4v1708500000000!5m2!1sen!2slk"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IAAC Location Map"
                  className="absolute inset-0 filter grayscale-[20%] hover:grayscale-0 transition-all"
                ></iframe>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
                variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.08 } } }}
                whileHover={{ y: -8, boxShadow: '0px 28px 55px -30px rgba(15, 23, 42, 0.4)' }}
                transition={{ type: 'spring', stiffness: 210, damping: 22 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"></textarea>
                  </div>

                  <button type="button" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:brightness-110 flex items-center justify-center gap-2">
                    Send Message
                    <Send size={18} />
                  </button>
                </form>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

// --- Helper Component ---
function HourItem({ day, hours, note }) {
  return (
    <li className="flex justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="font-medium text-slate-700 flex items-center gap-1">
        {day}
        {note && <span className="text-xs text-yellow-600 font-normal">{note}</span>}
      </span>
      <span className="text-slate-600">{hours}</span>
    </li>
  );
}

export default ContactUs;