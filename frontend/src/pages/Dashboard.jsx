import React, { useEffect, useState } from 'react';
import { 
  Users, FileText, Plus, Search, Eye, Calendar, BookOpen, UploadCloud
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('course');
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);

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
    imageUrl: '',
    imageUrls: [],
  });

  const [eventForm, setEventForm] = useState({ 
    title: '', description: '', imageUrl: '', imageUrls: [], eventDate: '' 
  });

  const [courseStatus, setCourseStatus] = useState({ submitting: false, success: false, error: '' });
  const [practicalStatus, setPracticalStatus] = useState({ submitting: false, success: false, error: '' });
  const [eventStatus, setEventStatus] = useState({ submitting: false, success: false, error: '' });

  const handleEventImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setEventForm((f) => ({ ...f, imageUrl: '', imageUrls: [] }));
      return;
    }
    const urls = [];
    let loaded = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result || '');
        loaded += 1;
        if (loaded === files.length) {
          setEventForm((f) => ({
            ...f,
            imageUrl: urls[0] || '',
            imageUrls: urls,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePracticalImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setPracticalForm((f) => ({ ...f, imageUrl: '', imageUrls: [] }));
      return;
    }
    const urls = [];
    let loaded = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result || '');
        loaded += 1;
        if (loaded === files.length) {
          setPracticalForm((f) => ({
            ...f,
            imageUrl: urls[0] || '',
            imageUrls: urls,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [courseRes, eventRes, appRes, msgRes] = await Promise.allSettled([
          apiClient.get('/api/courses'),
          apiClient.get('/api/events'),
          apiClient.get('/api/admin/applications'),
          apiClient.get('/api/admin/messages'),
        ]);

        if (!isMounted) return;
        if (courseRes.status === 'fulfilled') setCourses(courseRes.value.data.items || []);
        if (eventRes.status === 'fulfilled') setEvents(eventRes.value.data.items || []);
        if (appRes.status === 'fulfilled') setApplications(appRes.value.data.items || []);
        if (msgRes.status === 'fulfilled') setMessages(msgRes.value.data.items || []);

      } catch (err) { console.error("Load error", err); }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 pt-32 px-6 pb-10 md:px-10">
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
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-slate-600 font-bold hover:underline bg-slate-100 px-3 py-1 rounded"
                        onClick={() => {
                          setActiveTab('course');
                          setEditingCourseId(c._id);
                          setCourseForm({
                            title: c.title || '',
                            duration: c.duration || '',
                            courseType: c.courseType || c.category || 'Airline & Aviation Programs',
                            shortDescription: c.shortDescription || '',
                            totalCourseFee: c.totalCourseFee || '',
                            minimumEntryRequirements: c.minimumEntryRequirements || '',
                            evaluationCriteria: c.evaluationCriteria || '',
                            examinationFormat: c.examinationFormat || '',
                            additionalNotes: c.additionalNotes || '',
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-xs text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded" 
                        onClick={async () => {
                           if(!window.confirm("Delete this course?")) return;
                           try { 
                             await apiClient.delete(`/api/courses/${c._id}`); 
                             setCourses(prev => prev.filter(x => x._id !== c._id)); 
                             if (editingCourseId === c._id) {
                               setEditingCourseId(null);
                             }
                           } catch(e){ alert("Failed to delete"); }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Existing Events</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="p-6 text-slate-400 text-sm">No events yet</div>
                ) : (
                  events.map((ev) => (
                    <div key={ev._id} className="px-6 py-4 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-bold text-slate-800">{ev.title}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : 'No date set'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-xs text-slate-600 font-bold hover:underline bg-slate-100 px-3 py-1 rounded"
                          onClick={() => {
                            setActiveTab('event');
                            setEditingEventId(ev._id);
                            setEventForm({
                              title: ev.title || '',
                              description: ev.description || '',
                              imageUrl: ev.imageUrl || '',
                              imageUrls: ev.imageUrls || [],
                              eventDate: ev.eventDate ? ev.eventDate.substring(0, 10) : '',
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded"
                          onClick={async () => {
                            if (!window.confirm('Delete this event?')) return;
                            try {
                              await apiClient.delete(`/api/events/${ev._id}`);
                              setEvents((prev) => prev.filter((e) => e._id !== ev._id));
                              if (editingEventId === ev._id) {
                                setEditingEventId(null);
                              }
                            } catch (e) {
                              alert('Failed to delete');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-lg">Recent Applications</h3>
                <span className="text-xs text-slate-400">Latest 20</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {applications.length === 0 ? (
                  <div className="p-6 text-slate-400 text-sm">No applications yet</div>
                ) : (
                  applications.map((a) => (
                    <div key={a.id} className="px-6 py-3 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-semibold text-slate-800">{a.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{a.course || '—'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{a.contact}</div>
                      </div>
                      <button
                        className="text-xs text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded"
                        onClick={async () => {
                          if (!window.confirm('Delete this application?')) return;
                          try {
                            await apiClient.delete(`/api/admin/applications/${a.id}`);
                            setApplications((prev) => prev.filter((x) => x.id !== a.id));
                          } catch (e) {
                            alert('Failed to delete');
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contact & Career Support Messages */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-lg">Inbox Messages</h3>
                <span className="text-xs text-slate-400">Contact & Career Support</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-6 text-slate-400 text-sm">No messages yet</div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="px-6 py-3 flex justify-between items-center text-sm">
                      <div className="pr-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <span>{m.name}</span>
                          <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 bg-slate-100 text-slate-500">
                            {m.source === 'career-support' ? 'Career Support' : m.source === 'contact' ? 'Contact' : 'Other'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{m.subject}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{m.email}{m.phone ? ` · ${m.phone}` : ''}</div>
                      </div>
                      <button
                        className="text-xs text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded shrink-0"
                        onClick={async () => {
                          if (!window.confirm('Delete this message?')) return;
                          try {
                            await apiClient.delete(`/api/admin/messages/${m.id}`);
                            setMessages((prev) => prev.filter((x) => x.id !== m.id));
                          } catch (e) {
                            alert('Failed to delete');
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
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
                      if (editingCourseId) {
                        await apiClient.put(`/api/courses/${editingCourseId}`, payload);
                      } else {
                        await apiClient.post('/api/courses', payload);
                      }
                      setCourseStatus({ submitting: false, success: true, error: '' });
                      setEditingCourseId(null);
                      setCourseForm({
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
                      try {
                        const res = await apiClient.get('/api/courses');
                        setCourses(res.data.items || []);
                      } catch (_) {}
                    } catch (err) {
                      setCourseStatus({ submitting: false, success: false, error: err?.response?.data?.message || 'Error publishing' });
                    }
                }}>

                  {editingCourseId && (
                    <div className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                      Editing existing course. Save changes or clear the form to add a new one.
                    </div>
                  )}
                  
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

                  {courseStatus.success && (
                    <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                      Course saved successfully.
                    </div>
                  )}
                  {courseStatus.error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{courseStatus.error}</div>}
                  
                  <button type="submit" disabled={courseStatus.submitting} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm shadow-lg shadow-blue-600/20">
                    {courseStatus.submitting
                      ? (editingCourseId ? 'Saving changes...' : 'Publishing...')
                      : (editingCourseId ? 'Update Course' : 'Publish Course')}
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
                    setPracticalForm({
                      title: '',
                      duration: '',
                      shortDescription: '',
                      totalCourseFee: '',
                      minimumEntryRequirements: '',
                      additionalNotes: '',
                      imageUrl: '',
                      imageUrls: [],
                    });
                    try {
                      const res = await apiClient.get('/api/courses');
                      setCourses(res.data.items || []);
                    } catch (_) {}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Practical Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePracticalImageChange}
                      className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {practicalForm.imageUrls && practicalForm.imageUrls.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {practicalForm.imageUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Practical preview ${idx + 1}`}
                            className="h-20 w-full object-cover rounded-md border border-slate-200"
                          />
                        ))}
                      </div>
                    )}
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
                    if (editingEventId) {
                      await apiClient.put(`/api/events/${editingEventId}`, eventForm);
                    } else {
                      await apiClient.post('/api/events', eventForm);
                    }
                    setEventStatus({ submitting: false, success: true, error: '' });
                    setEditingEventId(null);
                    setEventForm({ title: '', description: '', imageUrl: '', imageUrls: [], eventDate: '' });
                    try {
                      const res = await apiClient.get('/api/events');
                      setEvents(res.data.items || []);
                    } catch (_) {}
                  } catch (err) {
                    setEventStatus({
                      submitting: false,
                      success: false,
                      error: err?.response?.data?.message || 'Error publishing',
                    });
                  }
                }}>
                  {editingEventId && (
                    <div className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                      Editing existing event. Save changes or clear the form to add a new one.
                    </div>
                  )}
                   <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title</label>
                    <input required value={eventForm.title} onChange={e => setEventForm(f => ({...f, title: e.target.value}))} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleEventImageChange}
                          className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                        />
                        {eventForm.imageUrls && eventForm.imageUrls.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {eventForm.imageUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Event preview ${idx + 1}`}
                                className="h-20 w-full object-cover rounded-md border border-slate-200"
                              />
                            ))}
                          </div>
                        )}
                    </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                    <input value={eventForm.eventDate} onChange={e => setEventForm(f => ({...f, eventDate: e.target.value}))} type="date" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"/>
                  </div>
                  
                  <button type="submit" disabled={eventStatus.submitting} className="w-full py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-sm shadow-lg shadow-orange-600/20">
                    {eventStatus.submitting ? 'Publishing...' : 'Publish Event'}
                  </button>
                  {eventStatus.error && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1">
                      {eventStatus.error}
                    </div>
                  )}
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