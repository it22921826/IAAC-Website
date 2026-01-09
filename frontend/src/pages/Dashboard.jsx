import React, { useEffect, useState } from 'react';
import { 
  Users, FileText, Calendar, BookOpen, UploadCloud,
  ChevronLeft, ChevronRight, Trash2, MessageSquare, Briefcase, Bell, Eye, X, CheckCircle, Mail, Phone, MapPin
} from 'lucide-react';
import apiClient from '../services/apiClient.js';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

// --- CALENDAR HELPERS ---
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

function Dashboard() {
  const [activeTab, setActiveTab] = useState('application'); 
  
  // Data State
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [notices, setNotices] = useState([]);

  // Modal State
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  // Editing State
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Forms State
  const [courseForm, setCourseForm] = useState({});
  const [practicalForm, setPracticalForm] = useState({});
  const [eventForm, setEventForm] = useState({});
  const [staffForm, setStaffForm] = useState({});
  const [noticeForm, setNoticeForm] = useState({});

  // Status State
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  // Navigation Items
  const navItems = [
    { value: 'application', label: 'Applications', icon: Briefcase },
    { value: 'message', label: 'Messages', icon: MessageSquare },
    { value: 'course', label: 'Courses', icon: BookOpen },
    { value: 'practical', label: 'Practical', icon: UploadCloud },
    { value: 'event', label: 'Events', icon: Calendar },
    { value: 'staff', label: 'Staff', icon: Users },
    { value: 'notice', label: 'Notices', icon: Bell },
  ];

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

  // --- CALENDAR LOGIC ---
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  const prevMonth = () => setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, currentMonth.getMonth() + 1, 1));

  // --- HELPER: SAFE TEXT ---
  const safeText = (value) => {
    if (value === null || value === undefined) return '-';
    return String(value).trim() || '-';
  };

  // --- IMPROVED PDF DOWNLOAD ---
  const downloadApplicationPdf = (app) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // Header Background
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 100, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Dark Blue
    doc.text('IAAC', 40, 50);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139); // Slate
    doc.text('Student Admission Application', 40, 75);

    doc.setFontSize(10);
    doc.text(`Ref ID: ${app.id || 'N/A'}`, pageWidth - 40, 50, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 40, 75, { align: 'right' });

    y = 130;

    // Helper to draw sections
    const drawSection = (title, data) => {
      // Section Header
      doc.setFillColor(239, 246, 255); // Light Blue
      doc.rect(40, y, pageWidth - 80, 25, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text(title.toUpperCase(), 50, y + 17);
      
      y += 40;

      // Fields
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      data.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 50, y);
        
        doc.setFont('helvetica', 'normal');
        const textValue = safeText(value);
        const splitText = doc.splitTextToSize(textValue, 350); // Wrap long text
        doc.text(splitText, 180, y);
        
        // Add spacing based on number of lines
        y += (splitText.length * 14) + 6; 
      });

      y += 15; // Spacer after section
    };

    // 1. Personal Info
    drawSection('Personal Information', [
      ['Full Name', app.fullName || app.name],
      ['Name with Initials', app.nameWithInitials],
      ['Date of Birth', app.dob ? new Date(app.dob).toLocaleDateString() : '-'],
      ['Gender', app.gender],
      ['NIC / Passport', app.nic],
      ['Address', app.homeAddress || app.address],
    ]);

    // 2. Contact Info
    drawSection('Contact Details', [
      ['Email Address', app.email],
      ['Mobile Number', app.mobile || app.contact],
      ['WhatsApp Number', app.whatsapp],
    ]);

    // 3. Academic & Parent
    drawSection('Education & Guardian', [
      ['School Attended', app.school],
      ['Course Applied', app.course || app.courseApplied],
      ['Guardian Name', app.parentName],
      ['Guardian Contact', app.parentPhone || app.parentMobile],
    ]);

    // O/L Results special table if exists
    if(app.olResults) {
        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.text("G.C.E O/L Results Summary:", 50, y);
        y += 20;
        let xPos = 50;
        Object.entries(app.olResults).forEach(([subj, grade]) => {
            doc.setFont('helvetica', 'normal');
            doc.text(`${subj.charAt(0).toUpperCase() + subj.slice(1)}: ${grade || '-'}`, xPos, y);
            xPos += 120;
            if(xPos > pageWidth - 100) {
                xPos = 50;
                y += 15;
            }
        });
    }

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(40, doc.internal.pageSize.getHeight() - 50, pageWidth - 40, doc.internal.pageSize.getHeight() - 50);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('This document is electronically generated by the IAAC Administration System.', pageWidth / 2, doc.internal.pageSize.getHeight() - 30, { align: 'center' });

    const fileSafeName = String(app.fullName || 'Student').replace(/[^a-z0-9]+/gi, '_');
    doc.save(`IAAC_Application_${fileSafeName}.pdf`);
  };

  // --- IMPROVED PRINT LAYOUT ---
  const printApplication = (app) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Application - ${safeText(app.fullName)}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
            .header h1 { color: #1e3a8a; margin: 0; font-size: 28px; text-transform: uppercase; }
            .header p { color: #64748b; margin: 5px 0 0; font-size: 14px; }
            
            .section { margin-bottom: 30px; }
            .section-title { background: #f1f5f9; padding: 8px 12px; font-weight: bold; color: #1e40af; border-left: 4px solid #2563eb; margin-bottom: 15px; text-transform: uppercase; font-size: 14px; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .field { margin-bottom: 10px; }
            .label { font-size: 12px; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px; }
            .value { font-size: 15px; font-weight: 500; color: #0f172a; border-bottom: 1px dotted #cbd5e1; padding-bottom: 2px; }
            
            .ol-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .ol-table td { border: 1px solid #e2e8f0; padding: 8px; font-size: 14px; }
            .ol-table td.subj { background: #f8fafc; font-weight: 600; width: 60%; }
            
            .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            
            @media print {
              body { padding: 0; }
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>International Airline & Aviation College</h1>
            <p>Student Admission Application Form</p>
          </div>

          <div class="section">
            <div class="section-title">Program Details</div>
            <div class="field">
              <span class="label">Course Applied For</span>
              <div class="value">${safeText(app.course || app.courseApplied)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="grid">
              <div class="field"><span class="label">Full Name</span><div class="value">${safeText(app.fullName || app.name)}</div></div>
              <div class="field"><span class="label">Name with Initials</span><div class="value">${safeText(app.nameWithInitials)}</div></div>
              <div class="field"><span class="label">NIC / Passport</span><div class="value">${safeText(app.nic)}</div></div>
              <div class="field"><span class="label">Date of Birth</span><div class="value">${app.dob ? new Date(app.dob).toLocaleDateString() : '-'}</div></div>
              <div class="field"><span class="label">Gender</span><div class="value">${safeText(app.gender)}</div></div>
              <div class="field"><span class="label">Mobile</span><div class="value">${safeText(app.mobile || app.contact)}</div></div>
              <div class="field"><span class="label">Email</span><div class="value">${safeText(app.email)}</div></div>
              <div class="field"><span class="label">WhatsApp</span><div class="value">${safeText(app.whatsapp)}</div></div>
            </div>
            <div class="field" style="margin-top: 10px;">
              <span class="label">Home Address</span>
              <div class="value">${safeText(app.homeAddress || app.address)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Education & Guardian</div>
            <div class="grid">
              <div class="field"><span class="label">School Attended</span><div class="value">${safeText(app.school)}</div></div>
              <div class="field"><span class="label">Guardian Name</span><div class="value">${safeText(app.parentName)}</div></div>
              <div class="field"><span class="label">Guardian Contact</span><div class="value">${safeText(app.parentPhone || app.parentMobile)}</div></div>
            </div>
          </div>

          ${app.olResults ? `
          <div class="section">
            <div class="section-title">G.C.E. O/L Results</div>
            <table class="ol-table">
              ${Object.entries(app.olResults).map(([k, v]) => `<tr><td class="subj">${k.charAt(0).toUpperCase() + k.slice(1)}</td><td>${v || '-'}</td></tr>`).join('')}
            </table>
          </div>
          ` : ''}

          <div class="footer">
            Generated on ${new Date().toLocaleString()} by IAAC Admin Portal.<br/>
            This is a computer-generated document and requires no signature.
          </div>

          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
      </html>
    `;

    const w = window.open('', '_blank', 'width=900,height=800');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  // --- VIEW: APPLICATIONS (CARD GRID) ---
  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-bold text-slate-800 text-2xl">Student Applications</h3>
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-blue-200">
          {applications.length} Pending
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
          No applications received yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={app.id} 
              className={`group relative p-6 rounded-3xl border transition-all duration-300 ${
                app.isDone 
                  ? 'bg-slate-50 border-slate-200 opacity-75' 
                  : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
                  app.isDone ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'
                }`}>
                  {(app.fullName || app.name || '?').charAt(0)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  app.isDone ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'
                }`}>
                  {app.course || 'General'}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h4 className={`font-bold text-lg mb-1 truncate ${app.isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {app.fullName || app.name}
                </h4>
                <p className="text-xs text-slate-400 mb-4">{app.nic || 'No NIC'}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" /> {app.mobile || app.contact || '-'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={14} className="text-slate-400" /> {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <button 
                  onClick={() => setSelectedApplication(app)}
                  className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Eye size={14} /> View Details
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      try {
                        const res = await apiClient.patch(`/api/admin/applications/${app.id}/done`);
                        const isDone = !!res?.data?.isDone;
                        setApplications((prev) => prev.map((x) => (x.id === app.id ? { ...x, isDone } : x)));
                      } catch (e) {}
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      app.isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    title={app.isDone ? "Mark Pending" : "Mark Done"}
                  >
                    <CheckCircle size={16} />
                  </button>
                  
                  <button 
                    onClick={async () => {
                      if(window.confirm('Delete application?')) {
                        await apiClient.delete(`/api/admin/applications/${app.id}`);
                        setApplications(prev => prev.filter(x => x.id !== app.id));
                      }
                    }}
                    disabled={app.isDone}
                    className={`p-2 rounded-full transition-colors ${
                      app.isDone ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // --- VIEW: MESSAGES (CLEAN LIST) ---
  const renderMessages = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-lg">Inbox</h3>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{messages.length} Messages</div>
      </div>
      <div className="divide-y divide-slate-100">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No new messages.</div>
        ) : messages.map((msg) => (
          <div key={msg.id} className={`p-6 transition-all hover:bg-slate-50 ${msg.isDone ? 'opacity-50 grayscale' : ''}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{msg.name}</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-blue-100">
                    {msg.subject || 'Inquiry'}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto md:ml-0">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {msg.message || 'No content provided.'}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                  {msg.email && (
                    <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-blue-600">
                      <Mail size={12} /> {msg.email}
                    </a>
                  )}
                  {msg.phone && (
                    <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                      <Phone size={12} /> {msg.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Message Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await apiClient.patch(`/api/admin/messages/${msg.id}/done`);
                      const isDone = !!res?.data?.isDone;
                      setMessages((prev) => prev.map((x) => (x.id === msg.id ? { ...x, isDone } : x)));
                    } catch (e) {}
                  }}
                  className={`p-2 rounded-lg transition-colors ${msg.isDone ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                  title="Mark as Read"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete message?')) {
                      await apiClient.delete(`/api/admin/messages/${msg.id}`);
                      setMessages(prev => prev.filter(x => x.id !== msg.id));
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="sticky top-0 h-screen w-20 md:w-64 bg-white border-r border-slate-200 pt-24 pb-6 flex flex-col transition-all duration-300 z-30">
        <nav className="flex-1 space-y-2 px-3">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.value 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden md:block">{item.label}</span>
              {item.value === 'application' && applications.length > 0 && (
                <span className={`hidden md:flex ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === 'application' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                  {applications.filter(a => !a.isDone).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 pt-24 px-6 pb-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 capitalize flex items-center gap-3">
              {navItems.find(n => n.value === activeTab)?.icon && React.createElement(navItems.find(n => n.value === activeTab).icon, { className: "text-blue-600" })}
              {navItems.find(n => n.value === activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1 ml-10">Manage your academy's {activeTab}s.</p>
          </header>

          {/* CONTENT SWITCHER */}
          {activeTab === 'application' && renderApplications()}
          {activeTab === 'message' && renderMessages()}
          
          {/* Reuse logic for other tabs (Courses, Events, etc.) */}
          {['course', 'practical', 'event', 'staff', 'notice'].includes(activeTab) && (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed">
              <p>Content for <strong>{activeTab}</strong> goes here.</p>
              <p className="text-sm">(Re-paste your Course/Event/Staff code block here if needed)</p>
            </div>
          )}

        </div>
      </main>

      {/* --- APPLICATION DETAILS MODAL (POPUP) --- */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Application Details</h2>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mt-1">ID: {selectedApplication.id}</p>
                </div>
                <button onClick={() => setSelectedApplication(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400"/></button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Header Info */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-200">
                    {(selectedApplication.fullName || selectedApplication.name || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedApplication.fullName || selectedApplication.name}</h3>
                    <p className="text-slate-500">{selectedApplication.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">{selectedApplication.course || 'No Course'}</span>
                      {selectedApplication.isDone && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Processed</span>}
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">NIC / Passport</label><p className="font-medium text-slate-800">{selectedApplication.nic || '-'}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Date of Birth</label><p className="font-medium text-slate-800">{selectedApplication.dob ? new Date(selectedApplication.dob).toLocaleDateString() : '-'}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Phone</label><p className="font-medium text-slate-800">{selectedApplication.mobile || '-'}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">WhatsApp</label><p className="font-medium text-slate-800">{selectedApplication.whatsapp || '-'}</p></div>
                  <div className="col-span-2"><label className="text-xs font-bold text-slate-400 uppercase">Address</label><p className="font-medium text-slate-800">{selectedApplication.homeAddress || '-'}</p></div>
                </div>

                {/* Education */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-blue-500"/> Education History</h4>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm mb-3"><span className="font-bold text-slate-600">School:</span> {selectedApplication.school || '-'}</p>
                    
                    {selectedApplication.olResults && (
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(selectedApplication.olResults).map(([subj, grade]) => (
                          <div key={subj} className="bg-white px-3 py-2 rounded-lg border border-slate-200 flex justify-between text-xs">
                            <span className="capitalize text-slate-500">{subj}</span>
                            <span className="font-bold text-slate-900">{grade || '-'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Parent */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={18} className="text-blue-500"/> Guardian Info</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Name</label><p className="font-medium text-slate-800">{selectedApplication.parentName || '-'}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Contact</label><p className="font-medium text-slate-800">{selectedApplication.parentPhone || '-'}</p></div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                <button 
                  onClick={() => downloadApplicationPdf(selectedApplication)}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <FileText size={16}/> Save as PDF
                </button>
                <button 
                  onClick={() => printApplication(selectedApplication)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText size={16}/> Print Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Dashboard;