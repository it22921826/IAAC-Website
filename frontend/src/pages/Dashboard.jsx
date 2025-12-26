import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Plus, 
  Search,
  Eye,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import apiClient from '../services/apiClient.js';

function Dashboard() {
  // Simple state to toggle between the two forms (Course vs Event)
  const [activeTab, setActiveTab] = useState('course');
  const [healthStatus, setHealthStatus] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [applicationsData, setApplicationsData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const res = await apiClient.get('/api/health');
        if (isMounted) {
          setHealthStatus(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setHealthStatus({ error: 'Unable to reach backend' });
        }
      }
    }

    checkHealth();

    async function fetchStats() {
      try {
        const res = await apiClient.get('/api/admin/stats');
        if (isMounted) setStatsData(res.data);
      } catch (err) {
        if (isMounted) setStatsData(null);
      }
    }

    async function fetchApplications() {
      try {
        const res = await apiClient.get('/api/admin/applications');
        if (isMounted) setApplicationsData(res.data.items || []);
      } catch (err) {
        if (isMounted) setApplicationsData([]);
      }
    }

    fetchStats();
    fetchApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage applications, courses, and events from one place.</p>
        </div>

        {/* --- BACKEND / DB STATUS BANNER --- */}
        {healthStatus && (
          <div className="mb-6">
            {healthStatus.error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Backend status: {healthStatus.error}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex flex-wrap items-center gap-3">
                <span className="font-semibold">Backend:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  {healthStatus.status}
                </span>
                <span className="text-xs text-emerald-700">
                  DB: {healthStatus.db}
                </span>
              </div>
            )}
          </div>
        )}

        {/* --- 1. STATS OVERVIEW (With Daily Count) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Applications Today" 
            value={statsData?.applicationsToday ?? '–'} 
            subtext={`Total for ${statsData?.period ?? '–'}`} 
            Icon={FileText} 
            color="bg-blue-600"
          />
          <StatCard 
            title="Total Students" 
            value={statsData?.totalStudents ?? '–'} 
            subtext="Monthly growth" 
            Icon={Users} 
            color="bg-indigo-600"
          />
          <StatCard 
            title="Upcoming Events" 
            value={statsData?.upcomingEvents ?? '–'} 
            subtext="Scheduled for this week" 
            Icon={Calendar} 
            color="bg-orange-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- 2. APPLICANT DETAILS (Left Column - Wider) --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Recent Applications</h3>
                <div className="relative">
                  <input type="text" placeholder="Search name..." className="pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Course Applied</th>
                      <th className="px-6 py-4 font-semibold">Contact</th>
                      <th className="px-6 py-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {applicationsData.length === 0 ? (
                      <tr>
                        <td className="px-6 py-6 text-center text-slate-400" colSpan="4">No applications found</td>
                      </tr>
                    ) : (
                      applicationsData.map((a, idx) => (
                        <TableRow key={idx} name={a.name} course={a.course} contact={a.contact} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-sm text-blue-600 font-bold hover:underline">View All Applications</button>
              </div>
            </div>
          </div>

          {/* --- 3. CONTENT MANAGEMENT (Right Column - Forms) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-6">Quick Actions</h3>
              
              {/* Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                <button 
                  onClick={() => setActiveTab('course')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'course' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  + Add Course
                </button>
                <button 
                  onClick={() => setActiveTab('event')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'event' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  + Add Event
                </button>
              </div>

              {/* FORM: ADD COURSE */}
              {activeTab === 'course' && (
                <form className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Title</label>
                    <input type="text" placeholder="e.g. Adv. Diploma in Aviation" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                    <input type="text" placeholder="e.g. 6 Months" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                  </div>
                  <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Plus size={16} /> Publish Course
                  </button>
                </form>
              )}

              {/* FORM: ADD EVENT */}
              {activeTab === 'event' && (
                <form className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title</label>
                    <input type="text" placeholder="e.g. Graduation Ceremony 2025" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Image</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                      <UploadCloud size={32} className="mb-2" />
                      <span className="text-xs">Click to upload image</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea rows="3" placeholder="Event details..." className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm resize-none"></textarea>
                  </div>

                  <button className="w-full py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Calendar size={16} /> Publish Event
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

// --- Helper Components ---

function StatCard({ title, value, subtext, Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
      </div>
      <div className={`p-4 rounded-xl text-white ${color} shadow-lg shadow-blue-900/10`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

function TableRow({ name, course, contact }) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      <td className="px-6 py-4 font-bold text-slate-800">{name}</td>
      <td className="px-6 py-4 text-slate-600">{course}</td>
      <td className="px-6 py-4 text-slate-500">{contact}</td>
      <td className="px-6 py-4 text-center">
        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-100 transition-colors">
          <Eye size={14} /> View
        </button>
      </td>
    </tr>
  );
}

export default Dashboard;
