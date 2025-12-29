import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, CreditCard, BookOpen, Calendar, 
  CheckCircle, AlertCircle, FileText, ChevronLeft 
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

function CourseDetails() {
  // FIX: We must use 'courseId' to match your App.jsx Route
  const { courseId } = useParams(); 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await apiClient.get('/api/courses');
        // FIX: Compare c._id with courseId
        const found = res.data.items.find(c => c._id === courseId);
        setCourse(found);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]); // FIX: Depend on courseId

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  
  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-white mb-4">Course Not Found</h1>
        <p className="text-slate-400 mb-8">This course may have been removed or is unavailable.</p>
        <Link to="/training" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
          Back to Training Programs
        </Link>
      </div>
    );
  }

  // Helper to render lists
  const renderList = (text) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
      <li key={idx} className="flex items-start gap-3 text-slate-900">
        <CheckCircle className="text-blue-500 shrink-0 mt-1" size={18} />
        <span>{line}</span>
      </li>
    ));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="bg-slate-900 pt-40 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link to="/training" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
            <ChevronLeft size={20} /> Back to Courses
          </Link>
          
          <p className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-3">
            {course.courseType || course.category || 'Training Program'}
          </p>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {course.title}
          </h1>
          
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            {course.shortDescription || "Prepare for a successful career in aviation with our comprehensive training curriculum designed by industry experts."}
          </p>
        </div>
      </section>

      {/* --- 2. DETAILS GRID --- */}
      <section className="px-6 -mt-10 mb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <InfoCard 
              icon={CreditCard} 
              label="Total Course Fee" 
              value={course.totalCourseFee || 'Contact for Pricing'} 
              subtext="Installment plans available"
            />

            <InfoCard 
              icon={Clock} 
              label="Course Duration" 
              value={course.duration || 'Flexible'} 
              subtext="Part-Time / Full-Time"
            />

            {/* Entry Requirements Card */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-slate-400">
                <BookOpen size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Entry Requirements</span>
              </div>
              <div className="text-white font-bold text-lg whitespace-pre-line leading-relaxed">
                {course.minimumEntryRequirements || 'G.C.E O/L or Equivalent'}
              </div>
            </div>

            <InfoCard 
              icon={Calendar} 
              label="Class Schedules" 
              value="Weekdays & Weekends" 
              subtext="Flexible timing options"
            />

             <InfoCard 
              icon={FileText} 
              label="Evaluation Criteria" 
              value={course.evaluationCriteria || 'Written Exam'} 
              subtext={course.examinationFormat || 'Closed Book'}
            />

            {/* Apply Now Card */}
            <div className="bg-blue-600 p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
              <h3 className="text-white font-bold text-xl mb-2">Ready to Start?</h3>
              <p className="text-blue-100 text-sm mb-6">Enroll now and secure your spot.</p>
              <Link to="/apply-now" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 w-full">
                Apply Now
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- 3. SYLLABUS SECTION --- */}
      {course.additionalNotes && (
        <section className="bg-white py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <BookOpen size={28} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Course Syllabus & Content</h2>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12">
              <ul className="grid md:grid-cols-2 gap-y-4 gap-x-12">
                {renderList(course.additionalNotes)}
              </ul>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

function InfoCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-4 text-slate-400">
        <Icon size={24} />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{value}</h3>
      <p className="text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

export default CourseDetails;