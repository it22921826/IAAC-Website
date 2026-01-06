import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Award, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient.js';

const AcademicStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. FETCH DATA FROM API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Use your apiClient or fetch directly
        const response = await apiClient.get('/api/staff');
        // Handle different response structures if needed
        const items = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.items) ? response.data.items : [];
        setStaff(items);
        setLoading(false);
      } catch (err) {
        console.error(err);
        // Fallback for demo purposes if API fails or is empty
        setStaff([]); 
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- HEADER SECTION (Updated Color) --- */}
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
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Experts</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Our team consists of industry veterans, senior pilots, and aviation management professionals dedicated to your success.
          </motion.p>
        </div>
      </section>

      {/* STAFF GRID */}
      <div className="container mx-auto px-6 mt-16">
        {staff.length === 0 ? (
            <div className="text-center text-slate-500 py-20">No staff members found.</div>
        ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {staff.map((member) => (
                <StaffCard key={member._id} member={member} variants={itemVariants} />
              ))}
            </motion.div>
        )}
      </div>
    </div>
  );
};

// --- SINGLE CARD COMPONENT ---
function StaffCard({ member, variants }) {
  return (
    <motion.div 
      variants={variants}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="h-72 overflow-hidden bg-slate-200 relative">
        <img 
          src={member.imageUrl || member.image || "https://via.placeholder.com/400x400?text=No+Image"} 
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <p className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {member.role || "Academic Staff"}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
            {member.name}
        </h3>
        <p className="text-blue-600 font-semibold text-xs mb-4 uppercase tracking-wider">
          {member.role || "Lecturer"}
        </p>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-4">
          {member.bio || member.description}
        </p>

        <div className="pt-5 border-t border-slate-50 space-y-3">
          {member.qualifications && (
            <div className="flex items-start gap-3 text-slate-500 text-sm">
              <Award className="w-5 h-5 text-purple-500 shrink-0" />
              <span className="text-xs font-medium">{member.qualifications}</span>
            </div>
          )}
          
          {member.email && (
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <Mail className="w-5 h-5 text-blue-500 shrink-0" />
              <a href={`mailto:${member.email}`} className="text-xs hover:text-blue-600 transition-colors hover:underline">
                {member.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AcademicStaff;