import React, { useEffect, useMemo, useState } from 'react';
import { 
  Users, FileText, Calendar, BookOpen, UploadCloud,
  ChevronLeft, ChevronRight, Trash2, MessageSquare, Briefcase, Bell, Eye, X, CheckCircle, Mail, Phone, MapPin, Pencil
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
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  
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
    // Use individual non-blocking requests so critical data renders ASAP
    const cancelers = [];

    const get = (url, onSuccess) => {
      const controller = new AbortController();
      cancelers.push(controller);
      apiClient.get(url, { signal: controller.signal })
        .then((res) => { if (isMounted) onSuccess(res?.data?.items || []); })
        .catch(() => {});
    };

    // Priority: admin data first
    get('/api/admin/applications', (items) => setApplications(items));
    get('/api/admin/messages', (items) => setMessages(items));

    // Secondary: content lists (do not block rendering)
    get('/api/courses', (items) => setCourses(items));
    get('/api/events', (items) => setEvents(items));
    get('/api/staff', (items) => setStaffMembers(items));
    get('/api/notices', (items) => setNotices(items));

    return () => {
      isMounted = false;
      cancelers.forEach((c) => c.abort());
    };
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

  // --- COURSES: EDIT/DELETE ---
  const openEditCourse = (course) => {
    if (!course?._id) return;
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title || '',
      duration: course.duration || '',
      courseType: course.courseType || '',
      shortDescription: course.shortDescription || '',
      totalCourseFee: course.totalCourseFee || '',
      branchPrices: {
        iaacCity: course.branchPrices?.iaacCity || '',
        airportAcademy: course.branchPrices?.airportAcademy || '',
        iaacCenter: course.branchPrices?.iaacCenter || '',
      },
      minimumEntryRequirements: course.minimumEntryRequirements || '',
      evaluationCriteria: course.evaluationCriteria || '',
      examinationFormat: course.examinationFormat || '',
      additionalNotes: course.additionalNotes || '',
      imageUrl: course.imageUrl || '',
    });
  };

  const closeEditCourse = () => {
    setEditingCourseId(null);
    setCourseForm({});
  };

  const updateCourseForm = (patch) => {
    setCourseForm((prev) => ({ ...prev, ...patch }));
  };

  const updateBranchPrice = (key, value) => {
    setCourseForm((prev) => ({
      ...prev,
      branchPrices: { ...(prev.branchPrices || {}), [key]: value },
    }));
  };

  const saveCourseEdits = async () => {
    if (!editingCourseId) return;
    const payload = {
      title: (courseForm.title || '').trim(),
      duration: (courseForm.duration || '').trim(),
      courseType: (courseForm.courseType || '').trim(),
      shortDescription: (courseForm.shortDescription || '').trim() || undefined,
      totalCourseFee: (courseForm.totalCourseFee || '').trim() || undefined,
      branchPrices: {
        iaacCity: (courseForm.branchPrices?.iaacCity || '').trim() || undefined,
        airportAcademy: (courseForm.branchPrices?.airportAcademy || '').trim() || undefined,
        iaacCenter: (courseForm.branchPrices?.iaacCenter || '').trim() || undefined,
      },
      minimumEntryRequirements: (courseForm.minimumEntryRequirements || '').trim() || undefined,
      evaluationCriteria: (courseForm.evaluationCriteria || '').trim() || undefined,
      examinationFormat: (courseForm.examinationFormat || '').trim() || undefined,
      additionalNotes: (courseForm.additionalNotes || '').trim() || undefined,
      imageUrl: (courseForm.imageUrl || '').trim() || undefined,
    };

    // If all branchPrices are empty, don't send it.
    const bp = payload.branchPrices;
    if (!bp.iaacCity && !bp.airportAcademy && !bp.iaacCenter) {
      delete payload.branchPrices;
    }

    const res = await apiClient.put(`/api/courses/${editingCourseId}`, payload);
    const updated = res?.data;
    if (updated?._id) {
      setCourses((prev) => prev.map((c) => (String(c._id) === String(updated._id) ? updated : c)));
    }
    closeEditCourse();
  };

  const deleteCourseById = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this course?')) return;
    await apiClient.delete(`/api/courses/${id}`);
    setCourses((prev) => prev.filter((c) => String(c._id) !== String(id)));
    if (String(editingCourseId) === String(id)) {
      closeEditCourse();
    }
  };

  // --- HELPER: APPLICATION FIELD NORMALIZATION ---
  const getApplicationName = (app) => safeText(app?.fullName || app?.name);
  const getApplicationCourse = (app) => safeText(app?.course || app?.courseApplied || app?.program);
  const getApplicationPhone = (app) => safeText(app?.mobile || app?.contact || app?.phone);
  const getApplicationWhatsapp = (app) => safeText(app?.whatsapp);
  const getApplicationEmail = (app) => safeText(app?.email);
  const getApplicationAddress = (app) => safeText(app?.homeAddress || app?.address);

  const selectedApplication = useMemo(() => {
    if (!selectedApplicationId) return null;
    return applications.find((a) => String(a.id) === String(selectedApplicationId)) || null;
  }, [applications, selectedApplicationId]);

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
      ['Full Name', getApplicationName(app)],
      ['Name with Initials', app.nameWithInitials],
      ['Date of Birth', app.dob ? new Date(app.dob).toLocaleDateString() : '-'],
      ['Gender', app.gender],
      ['NIC / Passport', app.nic],
      ['Address', getApplicationAddress(app)],
    ]);

    // 2. Contact Info
    drawSection('Contact Details', [
      ['Email Address', getApplicationEmail(app)],
      ['Mobile Number', getApplicationPhone(app)],
      ['WhatsApp Number', getApplicationWhatsapp(app)],
    ]);

    // 3. Academic & Parent
    drawSection('Education & Guardian', [
      ['School Attended', app.school],
      ['Course Applied', getApplicationCourse(app)],
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

    const fileSafeName = String(getApplicationName(app) || 'Student').replace(/[^a-z0-9]+/gi, '_');
    doc.save(`IAAC_Application_${fileSafeName}.pdf`);
  };

  // --- IMPROVED PRINT LAYOUT ---
  const printApplication = (app) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Application - ${getApplicationName(app)}</title>
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
              <div class="value">${getApplicationCourse(app)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="grid">
              <div class="field"><span class="label">Full Name</span><div class="value">${getApplicationName(app)}</div></div>
              <div class="field"><span class="label">Name with Initials</span><div class="value">${safeText(app.nameWithInitials)}</div></div>
              <div class="field"><span class="label">NIC / Passport</span><div class="value">${safeText(app.nic)}</div></div>
              <div class="field"><span class="label">Date of Birth</span><div class="value">${app.dob ? new Date(app.dob).toLocaleDateString() : '-'}</div></div>
              <div class="field"><span class="label">Gender</span><div class="value">${safeText(app.gender)}</div></div>
              <div class="field"><span class="label">Mobile</span><div class="value">${getApplicationPhone(app)}</div></div>
              <div class="field"><span class="label">Email</span><div class="value">${getApplicationEmail(app)}</div></div>
              <div class="field"><span class="label">WhatsApp</span><div class="value">${getApplicationWhatsapp(app)}</div></div>
            </div>
            <div class="field" style="margin-top: 10px;">
              <span class="label">Home Address</span>
              <div class="value">${getApplicationAddress(app)}</div>
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
          {applications.filter((a) => !a.isDone).length} Pending
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
                  {getApplicationName(app)}
                </h4>
                <p className="text-xs text-slate-400 mb-4">{app.nic || 'No NIC'}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" /> {getApplicationPhone(app)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={14} className="text-slate-400" /> {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <button 
                  onClick={() => setSelectedApplicationId(app.id)}
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

  // --- VIEW: COURSES ---
  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-bold text-slate-800 text-2xl">Courses</h3>
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-blue-200">
          {courses.length} Total
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
          No courses available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c._id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-lg text-slate-900 leading-snug whitespace-normal break-words">
                    {c.title}
                  </h4>
                  <div className="mt-2">
                    <span className="inline-flex text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-indigo-100">
                      {c.courseType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditCourse(c)}
                    className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="Edit course"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCourseById(c._id)}
                    className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">Duration: <span className="font-bold text-slate-800">{c.duration}</span></p>
              {c.shortDescription && <p className="text-sm text-slate-600 mb-3 line-clamp-3">{c.shortDescription}</p>}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {c.totalCourseFee && <div className="bg-slate-50 border border-slate-200 rounded-lg p-2"><span className="text-slate-500">Total Fee</span><div className="font-bold text-slate-800">{c.totalCourseFee}</div></div>}
                {c.branchPrices?.iaacCity && <div className="bg-slate-50 border border-slate-200 rounded-lg p-2"><span className="text-slate-500">City Campus</span><div className="font-bold text-slate-800">{c.branchPrices.iaacCity}</div></div>}
                {c.branchPrices?.airportAcademy && <div className="bg-slate-50 border border-slate-200 rounded-lg p-2"><span className="text-slate-500">Airport Academy</span><div className="font-bold text-slate-800">{c.branchPrices.airportAcademy}</div></div>}
                {c.branchPrices?.iaacCenter && <div className="bg-slate-50 border border-slate-200 rounded-lg p-2"><span className="text-slate-500">IAAC Center</span><div className="font-bold text-slate-800">{c.branchPrices.iaacCenter}</div></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- VIEW: PRACTICAL TRAININGS ---
  const renderPractical = () => {
    const trainings = courses.filter((c) => c.courseType === 'Practical Training');
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-slate-800 text-2xl">Practical Trainings</h3>
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-blue-200">
            {trainings.length} Total
          </span>
        </div>

        {trainings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            No practical trainings available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((t) => (
              <div key={t._id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-lg text-slate-900 leading-snug whitespace-normal break-words">
                      {t.title}
                    </h4>
                    <div className="mt-2">
                      <span className="inline-flex text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-emerald-100">
                        Practical
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditCourse(t)}
                      className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Edit course"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCourseById(t._id)}
                      className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">Duration: <span className="font-bold text-slate-800">{t.duration}</span></p>
                {t.shortDescription && <p className="text-sm text-slate-600 mb-3 line-clamp-3">{t.shortDescription}</p>}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {t.totalCourseFee && <div className="bg-slate-50 border border-slate-200 rounded-lg p-2"><span className="text-slate-500">Total Fee</span><div className="font-bold text-slate-800">{t.totalCourseFee}</div></div>}
                  {t.branchPrices?.airportAcademy && <div className="bg-slate-50 border border-slate-200 rounded-lg p-2"><span className="text-slate-500">Airport Academy</span><div className="font-bold text-slate-800">{t.branchPrices.airportAcademy}</div></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- VIEW: EVENTS ---
  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-bold text-slate-800 text-2xl">Events</h3>
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-blue-200">
          {events.length} Total
        </span>
      </div>

      {events.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
          No events available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div key={e._id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
              {e.imageUrl && (
                <img src={e.imageUrl} alt={e.title} className="w-full h-40 object-cover rounded-2xl mb-3 border border-slate-100" />
              )}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-lg text-slate-900 truncate">{e.title}</h4>
                {e.eventDate && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-blue-100">
                    {new Date(e.eventDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              {e.description && <p className="text-sm text-slate-600 line-clamp-3">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- VIEW: STAFF ---
  const renderStaff = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-bold text-slate-800 text-2xl">Staff</h3>
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-blue-200">
          {staffMembers.length} Total
        </span>
      </div>

      {staffMembers.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
          No staff members available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembers.map((s) => (
            <div key={s._id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-start gap-4">
                {s.imageUrl && (
                  <img src={s.imageUrl} alt={s.name} className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900 truncate">{s.name}</h4>
                  <div className="text-xs text-slate-500">{s.role || s.category || 'Staff'}</div>
                  {s.email && <div className="text-xs text-slate-600 mt-1">{s.email}</div>}
                </div>
              </div>
              {s.description && <p className="text-sm text-slate-600 mt-3 line-clamp-3">{s.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- VIEW: NOTICES ---
  const renderNotices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-bold text-slate-800 text-2xl">Notices</h3>
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-blue-200">
          {notices.length} Total
        </span>
      </div>

      {notices.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
          No notices available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((n) => (
            <div key={n._id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-lg text-slate-900 truncate">{n.title}</h4>
                <span className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-slate-200">
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
              {n.imageUrl && (
                <img src={n.imageUrl} alt={n.title} className="w-full h-32 object-cover rounded-2xl mb-3 border border-slate-100" />
              )}
              {n.description && <p className="text-sm text-slate-600 line-clamp-3">{n.description}</p>}
            </div>
          ))}
        </div>
      )}
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
          
          {activeTab === 'course' && renderCourses()}
          {activeTab === 'practical' && renderPractical()}
          {activeTab === 'event' && renderEvents()}
          {activeTab === 'staff' && renderStaff()}
          {activeTab === 'notice' && renderNotices()}

        </div>
      </main>

      {/* --- APPLICATION DETAILS MODAL (POPUP) --- */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedApplicationId(null)}
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
                <button onClick={() => setSelectedApplicationId(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400"/></button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Header Info */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-200">
                    {(selectedApplication.fullName || selectedApplication.name || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{getApplicationName(selectedApplication)}</h3>
                    <p className="text-slate-500">{getApplicationEmail(selectedApplication)}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">{getApplicationCourse(selectedApplication)}</span>
                      {selectedApplication.isDone && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Processed</span>}
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">NIC / Passport</label><p className="font-medium text-slate-800">{selectedApplication.nic || '-'}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Date of Birth</label><p className="font-medium text-slate-800">{selectedApplication.dob ? new Date(selectedApplication.dob).toLocaleDateString() : '-'}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Phone</label><p className="font-medium text-slate-800">{getApplicationPhone(selectedApplication)}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">WhatsApp</label><p className="font-medium text-slate-800">{getApplicationWhatsapp(selectedApplication)}</p></div>
                  <div className="col-span-2"><label className="text-xs font-bold text-slate-400 uppercase">Address</label><p className="font-medium text-slate-800">{getApplicationAddress(selectedApplication)}</p></div>
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

      {/* --- COURSE EDIT MODAL --- */}
      <AnimatePresence>
        {editingCourseId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeEditCourse}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Edit Course</h2>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mt-1">ID: {editingCourseId}</p>
                </div>
                <button onClick={closeEditCourse} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                    <input
                      value={courseForm.title || ''}
                      onChange={(e) => updateCourseForm({ title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="Course title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Type</label>
                    <input
                      value={courseForm.courseType || ''}
                      onChange={(e) => updateCourseForm({ courseType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="AIRLINE & AVIATION PROGRAMS"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                    <input
                      value={courseForm.duration || ''}
                      onChange={(e) => updateCourseForm({ duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="06 to 08 Months (Part Time)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Course Fee</label>
                    <input
                      value={courseForm.totalCourseFee || ''}
                      onChange={(e) => updateCourseForm({ totalCourseFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="LKR 100,000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL (optional)</label>
                    <input
                      value={courseForm.imageUrl || ''}
                      onChange={(e) => updateCourseForm({ imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                  <textarea
                    value={courseForm.shortDescription || ''}
                    onChange={(e) => updateCourseForm({ shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm min-h-[90px]"
                    placeholder="A short summary shown on cards"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="text-sm font-bold text-slate-800 mb-3">Branch Prices (optional)</div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">City Campus</label>
                      <input
                        value={courseForm.branchPrices?.iaacCity || ''}
                        onChange={(e) => updateBranchPrice('iaacCity', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none text-sm"
                        placeholder="LKR 80,000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Airport Academy</label>
                      <input
                        value={courseForm.branchPrices?.airportAcademy || ''}
                        onChange={(e) => updateBranchPrice('airportAcademy', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none text-sm"
                        placeholder="LKR 90,000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">IAAC Center</label>
                      <input
                        value={courseForm.branchPrices?.iaacCenter || ''}
                        onChange={(e) => updateBranchPrice('iaacCenter', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 outline-none text-sm"
                        placeholder="LKR 80,000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Minimum Entry Requirements</label>
                    <textarea
                      value={courseForm.minimumEntryRequirements || ''}
                      onChange={(e) => updateCourseForm({ minimumEntryRequirements: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm min-h-[90px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Evaluation Criteria</label>
                    <textarea
                      value={courseForm.evaluationCriteria || ''}
                      onChange={(e) => updateCourseForm({ evaluationCriteria: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm min-h-[90px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Examination Format</label>
                    <textarea
                      value={courseForm.examinationFormat || ''}
                      onChange={(e) => updateCourseForm({ examinationFormat: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm min-h-[90px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Additional Notes</label>
                    <textarea
                      value={courseForm.additionalNotes || ''}
                      onChange={(e) => updateCourseForm({ additionalNotes: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm min-h-[90px]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => deleteCourseById(editingCourseId)}
                  className="px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={saveCourseEdits}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  Save Changes
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