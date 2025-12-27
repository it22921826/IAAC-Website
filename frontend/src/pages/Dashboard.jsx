import React, { useEffect, useState } from 'react';
import { 
  Users, FileText, Plus, Search, Eye, Calendar, BookOpen, UploadCloud
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('course');
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  // --- FORM STATE ---
  const [courseForm, setCourseForm] = useState({
    title: '', 
    duration: '', 
    courseType: 'Airline & Aviation Programs', 
    shortDescription: '',
    totalCourseFee: '', 
    minimumEntryRequirements: '', 
    evaluationCriteria: '', 
    examinationFormat: '', 
    additionalNotes: '',
  });

  const [practicalForm, setPracticalForm] = useState({
    title: '', duration: '', shortDescription: '',
    totalCourseFee: '', minimumEntryRequirements: '',
    additionalNotes: '',
  });

  const [eventForm, setEventForm] = useState({ 
    title: '', description: '', imageUrl: '', eventDate: '' 
  });

  const [courseStatus, setCourseStatus] = useState({ submitting: false, success: false, error: '' });
  const [practicalStatus, setPracticalStatus] = useState({ submitting: false, success: false, error: '' });
  const [eventStatus, setEventStatus] = useState({ submitting: false, success: false, error: '' });

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [courseRes, eventRes] = await Promise.allSettled([
          apiClient.get('/api/courses'),
          apiClient.get('/api/events')
        ]);

        if (!isMounted) return;
        if(courseRes.status === 'fulfilled') setCourses(courseRes.value.data.items || []);
        if(eventRes.status === 'fulfilled') setEvents(eventRes.value.data.items || []);

      } catch (err) { console.error("Load error", err); }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: LISTS */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Existing Courses</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {courses.length === 0 ? <div className="p-6 text-slate-400">No courses yet</div> : courses.map(c => (
                  <div key={c._id} className="px-6 py-4 flex justify-between items-center text-sm">
                    <div>
                      <div className="font-bold text-slate-800">{c.title}</div>
                      <div className="text-xs text-blue-600 font-bold uppercase mt-1">
                        {c.courseType || c.category || 'Uncategorized'}
                      </div>
                    </div>
                    <button 
                      className="text-xs text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded" 
                      onClick={async () => {
                         if(!window.confirm("Delete this course?")) return;
                         try { 
                           await apiClient.delete(`/api/courses/${c._id}`); 
                           setCourses(prev => prev.filter(x => x._id !== c._id)); 
                         } catch(e){ alert("Failed to delete"); }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: FORMS */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-6">Quick Actions</h3>
              
              <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                {['course', 'practical', 'event'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${activeTab === tab ? 'bg-white shadow-sm text-blue-600 rounded-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* 1. ADD COURSE FORM */}
              {activeTab === 'course' && (
                <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setCourseStatus({ submitting: true, success: false, error: '' });
                    
                    const payload = {
                      ...courseForm,
                      courseType: courseForm.courseType,
                      category: courseForm.courseType,
                      type: courseForm.courseType
                    };

                    try {
                      await apiClient.post('/api/courses', payload);
                      setCourseStatus({ submitting: false, success: true, error: '' });
                      window.location.reload(); 
                    } catch (err) {
                      setCourseStatus({ submitting: false, success: false, error: err?.response?.data?.message || 'Error publishing' });
                    }
                }}>
                  
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Course Type (Required)</label>
                    <select
                      required
                      value={courseForm.courseType}
                      onChange={(e) => setCourseForm(f => ({ ...f, courseType: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md border border-blue-200 bg-white focus:border-blue-500 outline-none text-sm font-medium text-blue-900"
                    >
                      <option value="Airline & Aviation Programs">Airline & Aviation Programs</option>
                      <option value="Pilot Training Program">Pilot Training Program</option>
                      <option value="International Airline Diploma">International Airline Diploma</option>
                      <option value="Other Programs">Other Programs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Title</label>
                    <input required value={courseForm.title} onChange={e => setCourseForm(f => ({...f, title: e.target.value}))} type="text" placeholder="e.g. Diploma in Cabin Crew" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                    <input value={courseForm.duration} onChange={e => setCourseForm(f => ({...f, duration: e.target.value}))} type="text" placeholder="e.g. 6 Months" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fee</label>
                    <input value={courseForm.totalCourseFee} onChange={e => setCourseForm(f => ({...f, totalCourseFee: e.target.value}))} type="text" placeholder="e.g. LKR 100,000" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                    <textarea rows="2" value={courseForm.shortDescription} onChange={e => setCourseForm(f => ({...f, shortDescription: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"></textarea>
                  </div>

                  {/* --- RESTORED MISSING FIELDS --- */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Entry Requirements</label>
                    <textarea rows="3" value={courseForm.minimumEntryRequirements} onChange={e => setCourseForm(f => ({...f, minimumEntryRequirements: e.target.value}))} placeholder="List requirements here..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Evaluation</label>
                      <input value={courseForm.evaluationCriteria} onChange={e => setCourseForm(f => ({...f, evaluationCriteria: e.target.value}))} type="text" placeholder="e.g. Written Exam" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Exam Format</label>
                      <input value={courseForm.examinationFormat} onChange={e => setCourseForm(f => ({...f, examinationFormat: e.target.value}))} type="text" placeholder="e.g. Closed Book" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Syllabus / Notes</label>
                    <textarea rows="3" value={courseForm.additionalNotes} onChange={e => setCourseForm(f => ({...f, additionalNotes: e.target.value}))} placeholder="Paste syllabus details..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"></textarea>
                  </div>
                  {/* ------------------------------- */}

                  {courseStatus.success && <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">Course Published! Reloading...</div>}
                  {courseStatus.error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{courseStatus.error}</div>}
                  
                  <button type="submit" disabled={courseStatus.submitting} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm shadow-lg shadow-blue-600/20">
                    {courseStatus.submitting ? 'Publishing...' : 'Publish Course'}
                  </button>
                </form>
              )}

              {/* 2. ADD PRACTICAL FORM */}
              {activeTab === 'practical' && (
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setPracticalStatus({ submitting: true, success: false, error: '' });
                  
                  const payload = {
                    ...practicalForm,
                    courseType: 'Practical Training',
                    category: 'Practical Training',
                    type: 'Practical Training'
                  };

                  try {
                    await apiClient.post('/api/courses', payload);
                    setPracticalStatus({ submitting: false, success: true, error: '' });
                    window.location.reload();
                  } catch (err) {
                    setPracticalStatus({ submitting: false, success: false, error: 'Error publishing' });
                  }
                }}>
                   <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded mb-2 border border-emerald-100">
                     <strong>Note:</strong> This will automatically appear under the "Practical Training" section.
                   </div>
                   <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                    <input required value={practicalForm.title} onChange={e => setPracticalForm(f => ({...f, title: e.target.value}))} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                    <input value={practicalForm.duration} onChange={e => setPracticalForm(f => ({...f, duration: e.target.value}))} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea rows="2" value={practicalForm.shortDescription} onChange={e => setPracticalForm(f => ({...f, shortDescription: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"></textarea>
                  </div>
                  
                  <button type="submit" disabled={practicalStatus.submitting} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-sm shadow-lg shadow-emerald-600/20">
                    {practicalStatus.submitting ? 'Publishing...' : 'Publish Practical'}
                  </button>
                </form>
              )}

              {/* 3. ADD EVENT FORM */}
              {activeTab === 'event' && (
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setEventStatus({ submitting: true, success: false, error: '' });
                  try {
                    await apiClient.post('/api/events', eventForm);
                    setEventStatus({ submitting: false, success: true, error: '' });
                    setEventForm({ title: '', description: '', imageUrl: '', eventDate: '' });
                    window.location.reload();
                  } catch (err) {
                    setEventStatus({ submitting: false, success: false, error: 'Error publishing' });
                  }
                }}>
                   <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title</label>
                    <input required value={eventForm.title} onChange={e => setEventForm(f => ({...f, title: e.target.value}))} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                    <input value={eventForm.eventDate} onChange={e => setEventForm(f => ({...f, eventDate: e.target.value}))} type="date" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>
                  
                  <button type="submit" disabled={eventStatus.submitting} className="w-full py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-sm shadow-lg shadow-orange-600/20">
                    {eventStatus.submitting ? 'Publishing...' : 'Publish Event'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;