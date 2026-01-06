import React, { useEffect, useState } from 'react';
import { 
  Users, FileText, Plus, Search, Eye, Calendar, BookOpen, UploadCloud,
  ChevronLeft, ChevronRight, RefreshCw, LayoutDashboard, MessageSquare, Briefcase, Bell
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

// --- CALENDAR HELPERS ---
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

function Dashboard() {
  const [activeTab, setActiveTab] = useState('course');
  
  // Data State
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [notices, setNotices] = useState([]);
  
  // Editing State
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  // --- CALENDAR STATE ---
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // --- FORM STATE (Unchanged) ---
  const [courseForm, setCourseForm] = useState({
    title: '', duration: '', courseType: 'Airline & Aviation Programs', 
    shortDescription: '', totalCourseFee: '', minimumEntryRequirements: '', 
    evaluationCriteria: '', examinationFormat: '', additionalNotes: '',
    branchPrices: { iaacCity: '', airportAcademy: '', iaacCenter: '' },
  });

  const [practicalForm, setPracticalForm] = useState({
    title: '', duration: '', shortDescription: '',
    totalCourseFee: '', minimumEntryRequirements: '',
    additionalNotes: '', imageUrl: '', imageUrls: [],
  });

  const [eventForm, setEventForm] = useState({ 
    title: '', description: '', imageUrl: '', imageUrls: [], eventDate: '' 
  });

  const [staffForm, setStaffForm] = useState({
    name: '', description: '', imageUrl: '',
  });

  const [noticeForm, setNoticeForm] = useState({
    title: '', description: '', imageUrl: '',
  });

  // Status State
  const [courseStatus, setCourseStatus] = useState({ submitting: false, success: false, error: '' });
  const [practicalStatus, setPracticalStatus] = useState({ submitting: false, success: false, error: '' });
  const [eventStatus, setEventStatus] = useState({ submitting: false, success: false, error: '' });
  const [staffStatus, setStaffStatus] = useState({ submitting: false, success: false, error: '' });
  const [noticeStatus, setNoticeStatus] = useState({ submitting: false, success: false, error: '' });

  // Navigation Items
  const navItems = [
    { value: 'course', label: 'Courses', icon: BookOpen },
    { value: 'practical', label: 'Practical', icon: UploadCloud },
    { value: 'event', label: 'Events', icon: Calendar },
    { value: 'staff', label: 'Staff', icon: Users },
    { value: 'notice', label: 'Notices', icon: Bell },
  ];

  // --- IMAGE HANDLERS (Unchanged) ---
  const handleEventImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) { setEventForm((f) => ({ ...f, imageUrl: '', imageUrls: [] })); return; }
    const urls = []; let loaded = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result || ''); loaded += 1;
        if (loaded === files.length) { setEventForm((f) => ({ ...f, imageUrl: urls[0] || '', imageUrls: urls })); }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePracticalImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) { setPracticalForm((f) => ({ ...f, imageUrl: '', imageUrls: [] })); return; }
    const urls = []; let loaded = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result || ''); loaded += 1;
        if (loaded === files.length) { setPracticalForm((f) => ({ ...f, imageUrl: urls[0] || '', imageUrls: urls })); }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleStaffImageChange = (e) => {
    const file = (e.target.files || [])[0];
    if (!file) { setStaffForm((f) => ({ ...f, imageUrl: '' })); setStaffStatus({ submitting: false, success: false, error: '' }); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setStaffForm((f) => ({ ...f, imageUrl: reader.result || '' })); setStaffStatus((prev) => ({ ...prev, success: false, error: '' })); };
    reader.readAsDataURL(file);
  };

  const handleNoticeImageChange = (e) => {
    const file = (e.target.files || [])[0];
    if (!file) { setNoticeForm((f) => ({ ...f, imageUrl: '' })); setNoticeStatus({ submitting: false, success: false, error: '' }); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setNoticeForm((f) => ({ ...f, imageUrl: reader.result || '' })); setNoticeStatus((prev) => ({ ...prev, success: false, error: '' })); };
    reader.readAsDataURL(file);
  };

  // --- DATA FETCHING (Unchanged) ---
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [courseRes, eventRes, staffRes, noticeRes, appRes, msgRes] = await Promise.allSettled([
          apiClient.get('/api/courses'),
          apiClient.get('/api/events'),
          apiClient.get('/api/staff'),
          apiClient.get('/api/notices'),
          apiClient.get('/api/admin/applications'),
          apiClient.get('/api/admin/messages'),
        ]);

        if (!isMounted) return;
        if (courseRes.status === 'fulfilled') setCourses(courseRes.value.data.items || []);
        if (eventRes.status === 'fulfilled') setEvents(eventRes.value.data.items || []);
        if (staffRes.status === 'fulfilled') setStaffMembers(staffRes.value.data.items || []);
        if (noticeRes.status === 'fulfilled') setNotices(noticeRes.value.data.items || []);
        if (appRes.status === 'fulfilled') setApplications(appRes.value.data.items || []);
        if (msgRes.status === 'fulfilled') setMessages(msgRes.value.data.items || []);

      } catch (err) { console.error("Load error", err); }
    }
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // --- CALENDAR LOGIC (Unchanged) ---
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  const prevMonth = () => setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, currentMonth.getMonth() + 1, 1));
  const hasEventOnDay = (day) => {
    return events.some(ev => {
      if (!ev.eventDate) return false;
      const evDate = new Date(ev.eventDate);
      return evDate.getDate() === day && evDate.getMonth() === currentMonth.getMonth() && evDate.getFullYear() === currentMonth.getFullYear();
    });
  };
  const filteredEvents = selectedDate 
    ? events.filter(ev => {
        if (!ev.eventDate) return false;
        const evDate = new Date(ev.eventDate);
        return evDate.getDate() === selectedDate && evDate.getMonth() === currentMonth.getMonth() && evDate.getFullYear() === currentMonth.getFullYear();
      })
    : events;

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="fixed left-0 top-[4.5rem] bottom-0 z-40 w-20 md:w-64 bg-white border-r border-slate-200 pt-6 pb-4 flex flex-col transition-all duration-300">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Management</h2>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.value 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.value ? 'text-blue-600' : 'text-slate-400'} />
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Inbox Summary in Sidebar */}
        <div className="px-4 pt-4 mt-auto border-t border-slate-100 hidden md:block">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Overview</h3>
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <div className="flex items-center gap-2"><Briefcase size={16} /> Applications</div>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{applications.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-2"><MessageSquare size={16} /> Messages</div>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{messages.length}</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-20 md:ml-64 pt-24 px-6 pb-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 capitalize">
                Manage {activeTab}s
              </h1>
              <p className="text-slate-500 text-sm">Add, edit, or remove {activeTab} content.</p>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* --- LEFT COLUMN: DATA LISTS (Changes based on Tab) --- */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STAFF LIST */}
              {activeTab === 'staff' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Academic Staff ({staffMembers.length})</h3>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {staffMembers.length === 0 ? <div className="p-8 text-center text-slate-400">No staff added yet.</div> : staffMembers.map((member) => (
                      <div key={member._id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <img src={member.imageUrl || 'https://via.placeholder.com/100'} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800">{member.name}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2">{member.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => { setEditingStaffId(member._id); setStaffForm({ name: member.name || '', description: member.description || '', imageUrl: member.imageUrl || '' }); }} className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">Edit</button>
                          <button onClick={async () => { if(window.confirm("Delete?")) { try { await apiClient.delete(`/api/staff/${member._id}`); setStaffMembers(prev => prev.filter(s => s._id !== member._id)); } catch(e){} }}} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COURSES LIST */}
              {(activeTab === 'course' || activeTab === 'practical') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">
                      {activeTab === 'course' ? 'Academic Courses' : 'Practical Trainings'} ({courses.filter(c => activeTab === 'course' ? c.courseType !== 'Practical Training' : c.courseType === 'Practical Training').length})
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {courses.filter(c => activeTab === 'course' ? c.courseType !== 'Practical Training' : c.courseType === 'Practical Training').length === 0 
                      ? <div className="p-8 text-center text-slate-400">No records found.</div> 
                      : courses.filter(c => activeTab === 'course' ? c.courseType !== 'Practical Training' : c.courseType === 'Practical Training').map(c => (
                      <div key={c._id} className="p-4 flex justify-between items-start hover:bg-slate-50 transition-colors">
                        <div>
                          <h4 className="font-bold text-slate-800">{c.title}</h4>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">{c.courseType}</span>
                          <p className="text-xs text-slate-500 mt-1">{c.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setActiveTab(activeTab); setEditingCourseId(c._id); setCourseForm({ ...c, branchPrices: c.branchPrices || {} }); if(activeTab === 'practical') { setPracticalForm({...c, imageUrl: c.imageUrl || '', imageUrls: c.imageUrls || []}) } }} className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">Edit</button>
                          <button onClick={async () => { if(window.confirm("Delete?")) { await apiClient.delete(`/api/courses/${c._id}`); setCourses(prev => prev.filter(x => x._id !== c._id)); } }} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EVENTS CALENDAR & LIST */}
              {activeTab === 'event' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button onClick={prevMonth} className="p-1 hover:bg-white rounded shadow-sm"><ChevronLeft size={16} /></button>
                      <h3 className="font-bold text-slate-800">{monthName} {year}</h3>
                      <button onClick={nextMonth} className="p-1 hover:bg-white rounded shadow-sm"><ChevronRight size={16} /></button>
                    </div>
                    {selectedDate && <button onClick={() => setSelectedDate(null)} className="text-xs text-blue-600 font-medium">Clear Filter</button>}
                  </div>
                  
                  <div className="p-6">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-xs text-slate-400 font-bold">{d}</div>)}
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const hasEvt = hasEventOnDay(day);
                        return (
                          <button key={day} onClick={() => setSelectedDate(selectedDate === day ? null : day)}
                            className={`h-10 rounded-lg flex flex-col items-center justify-center text-sm transition-all ${selectedDate === day ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-700'} ${hasEvt && selectedDate !== day ? 'border-2 border-blue-100 font-bold' : ''}`}>
                            {day}
                            {hasEvt && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${selectedDate === day ? 'bg-white' : 'bg-blue-500'}`} />}
                          </button>
                        )
                      })}
                    </div>

                    {/* Events List */}
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Events List</h4>
                    <div className="space-y-2">
                      {filteredEvents.length === 0 ? <div className="text-sm text-slate-400 italic">No events found.</div> : filteredEvents.map(ev => (
                        <div key={ev._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-blue-300 transition-colors bg-white">
                          <div className="flex items-center gap-3">
                            <div className="text-center bg-blue-50 text-blue-700 rounded px-2 py-1 min-w-[50px]">
                              <div className="text-[10px] font-bold uppercase">{ev.eventDate ? new Date(ev.eventDate).toLocaleString('default', { month: 'short' }) : '-'}</div>
                              <div className="text-lg font-bold leading-none">{ev.eventDate ? new Date(ev.eventDate).getDate() : '-'}</div>
                            </div>
                            <div className="font-semibold text-slate-800 text-sm">{ev.title}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingEventId(ev._id); setEventForm({...ev, eventDate: ev.eventDate ? ev.eventDate.substring(0, 10) : ''}); }} className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded"><LayoutDashboard size={14} /></button>
                            <button onClick={async () => { if(window.confirm("Delete?")) { await apiClient.delete(`/api/events/${ev._id}`); setEvents(prev => prev.filter(e => e._id !== ev._id)); }}} className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded"><RefreshCw size={14} className="rotate-45" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NOTICES LIST */}
              {activeTab === 'notice' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Public Notices ({notices.length})</h3>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {notices.map((n) => (
                      <div key={n._id} className="p-4 flex gap-4 hover:bg-slate-50">
                        <img src={n.imageUrl || 'https://via.placeholder.com/50'} className="w-16 h-16 object-cover rounded-lg border border-slate-200" alt="Notice" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{n.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{n.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => { setEditingNoticeId(n._id); setNoticeForm({ title: n.title, description: n.description, imageUrl: n.imageUrl }); }} className="text-xs bg-slate-100 px-3 py-1 rounded font-bold text-slate-600">Edit</button>
                          <button onClick={async () => { if(window.confirm("Delete?")) { await apiClient.delete(`/api/notices/${n._id}`); setNotices(prev => prev.filter(x => x._id !== n._id)); }}} className="text-xs bg-red-50 px-3 py-1 rounded font-bold text-red-600">Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GENERAL INBOX (Visible always at bottom or separate tab) */}
              <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Briefcase size={16} /> Recent Applications</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {applications.length === 0 && <p className="text-xs text-slate-400">No applications.</p>}
                    {applications.map(a => (
                      <div key={a.id} className="text-xs p-3 bg-slate-50 rounded border border-slate-100 flex justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{a.name}</div>
                          <div className="text-slate-500">{a.course}</div>
                        </div>
                        <button onClick={async () => { if(window.confirm("Delete?")) { await apiClient.delete(`/api/admin/applications/${a.id}`); setApplications(prev => prev.filter(x => x.id !== a.id)); }}} className="text-red-500 hover:underline">Del</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><MessageSquare size={16} /> Messages</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {messages.length === 0 && <p className="text-xs text-slate-400">No messages.</p>}
                    {messages.map(m => (
                      <div key={m.id} className="text-xs p-3 bg-slate-50 rounded border border-slate-100 flex justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{m.name}</div>
                          <div className="text-slate-500 truncate max-w-[150px]">{m.subject}</div>
                        </div>
                        <button onClick={async () => { if(window.confirm("Delete?")) { await apiClient.delete(`/api/admin/messages/${m.id}`); setMessages(prev => prev.filter(x => x.id !== m.id)); }}} className="text-red-500 hover:underline">Del</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* --- RIGHT COLUMN: FORMS (Sticky) --- */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 p-6 md:p-8">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeTab === 'course' ? (editingCourseId ? 'Edit Course' : 'Add New Course') :
                     activeTab === 'practical' ? (practicalForm.title ? 'Edit Practical' : 'Add Practical') :
                     activeTab === 'event' ? (editingEventId ? 'Edit Event' : 'Add New Event') :
                     activeTab === 'staff' ? (editingStaffId ? 'Edit Staff Member' : 'Add Staff Member') :
                     (editingNoticeId ? 'Edit Notice' : 'Add New Notice')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Fill in the details below to publish.</p>
                </div>

                {/* --- COURSE FORM --- */}
                {activeTab === 'course' && (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault(); setCourseStatus({ submitting: true, success: false, error: '' });
                      const derivedTotal = courseForm.totalCourseFee || courseForm.branchPrices.iaacCity || '';
                      const payload = { ...courseForm, branchPrices: courseForm.branchPrices, totalCourseFee: derivedTotal, courseType: courseForm.courseType, category: courseForm.courseType, type: courseForm.courseType };
                      try {
                        if (editingCourseId) await apiClient.put(`/api/courses/${editingCourseId}`, payload);
                        else await apiClient.post('/api/courses', payload);
                        setCourseStatus({ submitting: false, success: true, error: '' }); setEditingCourseId(null);
                        setCourseForm({ title: '', duration: '', courseType: 'Airline & Aviation Programs', shortDescription: '', totalCourseFee: '', minimumEntryRequirements: '', evaluationCriteria: '', examinationFormat: '', additionalNotes: '', branchPrices: { iaacCity: '', airportAcademy: '', iaacCenter: '' } });
                        const res = await apiClient.get('/api/courses'); setCourses(res.data.items || []);
                      } catch (err) { setCourseStatus({ submitting: false, success: false, error: err?.response?.data?.message || 'Error' }); }
                  }}>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                      <select required value={courseForm.courseType} onChange={(e) => setCourseForm(f => ({ ...f, courseType: e.target.value }))} className="w-full text-sm border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white transition-colors">
                        <option>Airline & Aviation Programs</option><option>Pilot Training Program</option><option>International Airline Diploma</option><option>Other Programs</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input required placeholder="Course Title" value={courseForm.title} onChange={e => setCourseForm(f => ({...f, title: e.target.value}))} className="col-span-2 w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                      <input placeholder="Duration (e.g. 6 Months)" value={courseForm.duration} onChange={e => setCourseForm(f => ({...f, duration: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Branch Pricing</label>
                      <input placeholder="City Campus Fee" value={courseForm.branchPrices?.iaacCity} onChange={e=>setCourseForm(f=>({...f, branchPrices:{...f.branchPrices, iaacCity:e.target.value}, totalCourseFee: f.totalCourseFee || e.target.value}))} className="w-full text-xs border-slate-200 rounded p-2"/>
                      <input placeholder="Airport Academy Fee" value={courseForm.branchPrices?.airportAcademy} onChange={e=>setCourseForm(f=>({...f, branchPrices:{...f.branchPrices, airportAcademy:e.target.value}}))} className="w-full text-xs border-slate-200 rounded p-2"/>
                      <input placeholder="Kurunegala Center Fee" value={courseForm.branchPrices?.iaacCenter} onChange={e=>setCourseForm(f=>({...f, branchPrices:{...f.branchPrices, iaacCenter:e.target.value}}))} className="w-full text-xs border-slate-200 rounded p-2"/>
                    </div>

                    <textarea placeholder="Short Description" rows="2" value={courseForm.shortDescription} onChange={e => setCourseForm(f => ({...f, shortDescription: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <textarea placeholder="Entry Requirements" rows="2" value={courseForm.minimumEntryRequirements} onChange={e => setCourseForm(f => ({...f, minimumEntryRequirements: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Evaluation" value={courseForm.evaluationCriteria} onChange={e => setCourseForm(f => ({...f, evaluationCriteria: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                      <input placeholder="Exam Format" value={courseForm.examinationFormat} onChange={e => setCourseForm(f => ({...f, examinationFormat: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    </div>
                    <textarea placeholder="Syllabus / Additional Notes" rows="3" value={courseForm.additionalNotes} onChange={e => setCourseForm(f => ({...f, additionalNotes: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>

                    <button disabled={courseStatus.submitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform active:scale-95">
                      {courseStatus.submitting ? 'Processing...' : 'Save Course'}
                    </button>
                    {courseStatus.success && <p className="text-xs text-green-600 text-center font-bold">Saved successfully!</p>}
                  </form>
                )}

                {/* --- PRACTICAL FORM --- */}
                {activeTab === 'practical' && (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault(); setPracticalStatus({ submitting: true, success: false, error: '' });
                      const payload = { ...practicalForm, courseType: 'Practical Training', category: 'Practical Training', type: 'Practical Training' };
                      try { await apiClient.post('/api/courses', payload); setPracticalStatus({ submitting: false, success: true, error: '' }); setPracticalForm({ title: '', duration: '', shortDescription: '', totalCourseFee: '', minimumEntryRequirements: '', additionalNotes: '', imageUrl: '', imageUrls: [] }); const res = await apiClient.get('/api/courses'); setCourses(res.data.items || []); } catch (err) { setPracticalStatus({ submitting: false, success: false, error: 'Error' }); }
                  }}>
                    <input required placeholder="Practical Title" value={practicalForm.title} onChange={e => setPracticalForm(f => ({...f, title: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <input placeholder="Duration" value={practicalForm.duration} onChange={e => setPracticalForm(f => ({...f, duration: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <textarea placeholder="Description" rows="3" value={practicalForm.shortDescription} onChange={e => setPracticalForm(f => ({...f, shortDescription: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                      <input type="file" multiple accept="image/*" onChange={handlePracticalImageChange} className="hidden" id="practical-file" />
                      <label htmlFor="practical-file" className="cursor-pointer text-xs font-bold text-blue-600 block">Click to Upload Images</label>
                      <div className="flex gap-2 mt-2 justify-center">{practicalForm.imageUrls.map((u,i) => <img key={i} src={u} className="w-8 h-8 rounded object-cover" />)}</div>
                    </div>
                    <button disabled={practicalStatus.submitting} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all transform active:scale-95">{practicalStatus.submitting ? 'Saving...' : 'Publish Practical'}</button>
                    {practicalStatus.success && <p className="text-xs text-green-600 text-center font-bold">Published!</p>}
                  </form>
                )}

                {/* --- EVENT FORM --- */}
                {activeTab === 'event' && (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault(); setEventStatus({ submitting: true, success: false, error: '' });
                      try { if(editingEventId) await apiClient.put(`/api/events/${editingEventId}`, eventForm); else await apiClient.post('/api/events', eventForm); setEventStatus({ submitting: false, success: true, error: '' }); setEditingEventId(null); setEventForm({ title: '', description: '', imageUrl: '', imageUrls: [], eventDate: '' }); const res = await apiClient.get('/api/events'); setEvents(res.data.items || []); } catch (err) { setEventStatus({ submitting: false, success: false, error: 'Error' }); }
                  }}>
                    <input required placeholder="Event Title" value={eventForm.title} onChange={e => setEventForm(f => ({...f, title: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <input required type="date" value={eventForm.eventDate} onChange={e => setEventForm(f => ({...f, eventDate: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <textarea placeholder="Event Description" rows="3" value={eventForm.description} onChange={e => setEventForm(f => ({...f, description: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                      <input type="file" multiple accept="image/*" onChange={handleEventImageChange} className="hidden" id="event-file" />
                      <label htmlFor="event-file" className="cursor-pointer text-xs font-bold text-orange-600 block">Upload Event Images</label>
                      <div className="flex gap-2 mt-2 justify-center">{eventForm.imageUrls.map((u,i) => <img key={i} src={u} className="w-8 h-8 rounded object-cover" />)}</div>
                    </div>
                    <button disabled={eventStatus.submitting} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all transform active:scale-95">{eventStatus.submitting ? 'Saving...' : 'Publish Event'}</button>
                    {eventStatus.success && <p className="text-xs text-green-600 text-center font-bold">Event Saved!</p>}
                  </form>
                )}

                {/* --- STAFF FORM --- */}
                {activeTab === 'staff' && (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault(); setStaffStatus({ submitting: true, success: false, error: '' });
                      try { const pl = { name: staffForm.name, description: staffForm.description, imageUrl: staffForm.imageUrl }; if(editingStaffId) await apiClient.put(`/api/staff/${editingStaffId}`, pl); else await apiClient.post('/api/staff', pl); setStaffStatus({ submitting: false, success: true, error: '' }); setEditingStaffId(null); setStaffForm({ name: '', description: '', imageUrl: '' }); const res = await apiClient.get('/api/staff'); setStaffMembers(res.data.items || []); } catch (err) { setStaffStatus({ submitting: false, success: false, error: 'Error' }); }
                  }}>
                    <input required placeholder="Staff Name" value={staffForm.name} onChange={e => setStaffForm(f => ({...f, name: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <textarea placeholder="Role & Description" rows="3" value={staffForm.description} onChange={e => setStaffForm(f => ({...f, description: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <div className="flex items-center gap-4">
                      {staffForm.imageUrl && <img src={staffForm.imageUrl} className="w-12 h-12 rounded-full object-cover border" />}
                      <label className="cursor-pointer bg-slate-100 text-slate-600 px-4 py-2 rounded text-xs font-bold hover:bg-slate-200">
                        Upload Photo <input type="file" accept="image/*" onChange={handleStaffImageChange} className="hidden" />
                      </label>
                    </div>
                    <button disabled={staffStatus.submitting} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all transform active:scale-95">{staffStatus.submitting ? 'Saving...' : 'Save Staff Member'}</button>
                    {staffStatus.success && <p className="text-xs text-green-600 text-center font-bold">Saved!</p>}
                  </form>
                )}

                {/* --- NOTICE FORM --- */}
                {activeTab === 'notice' && (
                  <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault(); setNoticeStatus({ submitting: true, success: false, error: '' });
                      try { const pl = { title: noticeForm.title, description: noticeForm.description, imageUrl: noticeForm.imageUrl }; if(editingNoticeId) await apiClient.put(`/api/notices/${editingNoticeId}`, pl); else await apiClient.post('/api/notices', pl); setNoticeStatus({ submitting: false, success: true, error: '' }); setEditingNoticeId(null); setNoticeForm({ title: '', description: '', imageUrl: '' }); const res = await apiClient.get('/api/notices'); setNotices(res.data.items || []); } catch (err) { setNoticeStatus({ submitting: false, success: false, error: 'Error' }); }
                  }}>
                    <input required placeholder="Notice Title" value={noticeForm.title} onChange={e => setNoticeForm(f => ({...f, title: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <textarea placeholder="Notice Body" rows="4" value={noticeForm.description} onChange={e => setNoticeForm(f => ({...f, description: e.target.value}))} className="w-full text-sm border-slate-200 rounded-lg p-2.5"/>
                    <div className="flex items-center gap-4">
                      {noticeForm.imageUrl && <img src={noticeForm.imageUrl} className="w-12 h-12 rounded object-cover border" />}
                      <label className="cursor-pointer bg-slate-100 text-slate-600 px-4 py-2 rounded text-xs font-bold hover:bg-slate-200">
                        Attach Image <input type="file" accept="image/*" onChange={handleNoticeImageChange} className="hidden" />
                      </label>
                    </div>
                    <button disabled={noticeStatus.submitting} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95">{noticeStatus.submitting ? 'Saving...' : 'Publish Notice'}</button>
                    {noticeStatus.success && <p className="text-xs text-green-600 text-center font-bold">Saved!</p>}
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;