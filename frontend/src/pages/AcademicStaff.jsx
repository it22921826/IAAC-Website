import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Award, Loader2 } from 'lucide-react';

const AcademicStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. FETCH DATA FROM API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Replace with your actual backend URL
        const response = await fetch('http://localhost:5000/api/staff');
        if (!response.ok) {
          throw new Error('Failed to fetch staff data');
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setStaff(items);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white py-20 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Meet Our Experts
        </motion.h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Our team consists of industry veterans, senior pilots, and aviation management professionals dedicated to your success.
        </p>
      </div>

      {/* STAFF GRID */}
      <div className="container mx-auto px-6 mt-16">
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
      </div>
    </div>
  );
};

// --- SINGLE CARD COMPONENT ---
function StaffCard({ member, variants }) {
  return (
    <motion.div 
      variants={variants}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="h-64 overflow-hidden bg-slate-200 relative group">
        <img 
          src={member.imageUrl || member.image || "https://via.placeholder.com/400x400?text=No+Image"} 
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <p className="text-white font-medium">{member.role}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium text-sm mb-4 uppercase tracking-wide">
          {member.role}
        </p>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
          {member.bio || member.description}
        </p>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          {member.qualifications && (
            <div className="flex items-start gap-3 text-slate-500 text-sm">
              <Award className="w-5 h-5 text-purple-500 shrink-0" />
              <span>{member.qualifications}</span>
            </div>
          )}
          
          {member.email && (
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <Mail className="w-5 h-5 text-blue-500 shrink-0" />
              <a href={`mailto:${member.email}`} className="hover:text-blue-600 transition-colors">
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
