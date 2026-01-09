import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient.js';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  const [currentDate, setCurrentDate] = useState(new Date()); 

  // --- 1. FETCH DATA ---
  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await apiClient.get('/api/events');
        const data = res.data;
        const items = Array.isArray(data) ? data : data?.items;

        const formattedData = (Array.isArray(items) ? items : []).map((event) => {
          const rawDate = event.eventDate || event.date;
          const parsed = rawDate ? new Date(rawDate) : null;
          const date = parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
          return { ...event, date };
        });

        if (isMounted) setEvents(formattedData);
      } catch (err) {
        console.error("Failed to fetch events", err);
        if (isMounted) {
          setEvents([]);
          setError(err?.response?.data?.message || 'Failed to load events');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEvents();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!previewImages.length) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewImages([]);
        setPreviewIndex(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewImages.length]);

  const closePreview = () => {
    setPreviewImages([]);
    setPreviewIndex(0);
  };

  // --- CALENDAR LOGIC ---
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  // Events for the CURRENTLY SELECTED MONTH
  const monthEvents = events
    .filter((event) => {
      if (!event.date) return false;
      return event.date.getMonth() === currentDate.getMonth() && event.date.getFullYear() === currentDate.getFullYear();
    })
    .sort((a, b) => a.date - b.date);

  // Categories removed: render a single list for the month.

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      <AnimatePresence>
        {previewImages.length ? (
          <motion.div
            key="image-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="text-sm font-bold text-slate-700">Preview</div>
                <button
                  type="button"
                  className="text-sm font-bold text-slate-600 hover:text-slate-900"
                  onClick={closePreview}
                >
                  Close
                </button>
              </div>
              <div className="bg-slate-900">
                <img
                  src={previewImages[Math.min(previewIndex, previewImages.length - 1)]}
                  alt="Event preview"
                  className="w-full max-h-[80vh] object-contain"
                />
              </div>

              {previewImages.length > 1 && (
                <div className="px-4 py-3 border-t border-slate-100 bg-white">
                  <div className="flex gap-2 overflow-x-auto">
                    {previewImages.map((url, idx) => (
                      <button
                        key={`${url}-${idx}`}
                        type="button"
                        onClick={() => setPreviewIndex(idx)}
                        className={`shrink-0 rounded-lg overflow-hidden border ${
                          idx === previewIndex ? 'border-blue-500' : 'border-slate-200'
                        }`}
                        aria-label={`Preview image ${idx + 1}`}
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-16 h-16 object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* --- HERO SECTION (Updated to Dark Navy Brand Style) --- */}
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
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Keep track of our workshops, guest lectures, and student activities happening throughout the year.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        
        {/* --- TOOLBAR (Month Nav) --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Month Navigation */}
          <div className="flex items-center gap-6 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
            <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold text-slate-800 min-w-[140px] text-center">{monthName} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-600"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* --- EVENT GRID GALLERY --- */}
        <div className="min-h-[400px]">
          {error && (
            <div className="text-center py-4 text-red-600 bg-red-50 rounded-xl border border-red-100 mb-6">
              {error}
            </div>
          )}

          <AnimatePresence mode='popLayout'>
            {monthEvents.length > 0 ? (
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {monthEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onPreviewImages={(urls, startIndex = 0) => {
                      setPreviewImages(urls);
                      setPreviewIndex(startIndex);
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">No events scheduled</h3>
                <p className="text-slate-500 mt-2">There are no events listed for {monthName} {year}.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

// --- SINGLE EVENT CARD (Gallery Style) ---
function EventCard({ event, onPreviewImages }) {
  const dateObj = event.date;
  if (!dateObj) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isUpcoming = dateObj.getTime() >= todayStart.getTime();
  
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

  const imageCandidates = [event.imageUrl, ...(Array.isArray(event.imageUrls) ? event.imageUrls : [])].filter(Boolean);
  const images = Array.from(new Set(imageCandidates));
  const coverImage = images[0] || '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col h-full"
    >
      {/* Date Header Strip */}
      <div className={`${isUpcoming ? 'bg-emerald-600' : 'bg-blue-600'} px-6 py-3 flex justify-between items-center text-white`}>
        <span className="text-xs font-bold uppercase tracking-wider">{weekday}</span>
      </div>

      {/* Cover Image */}
      <button
        type="button"
        className="relative h-48 overflow-hidden bg-slate-200 text-left"
        onClick={() => {
          if (!coverImage) return;
          onPreviewImages?.(images, 0);
        }}
        aria-label={coverImage ? 'Preview event image' : 'No image available'}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
            <CalendarIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
      </button>

      <div className="p-6 flex flex-col flex-grow relative">
        {/* Date Box (Floating) */}
        <div className={`absolute top-4 right-6 ${isUpcoming ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'} rounded-xl w-14 h-14 flex flex-col items-center justify-center border shadow-sm`}>
          <span className="text-[10px] font-bold uppercase">{month}</span>
          <span className="text-xl font-extrabold leading-none">{day}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 pr-14 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {event.description}
        </p>

        {/* Details Footer */}
        <div className="pt-4 border-t border-slate-50" />
      </div>
    </motion.div>
  );
}

export default Events;