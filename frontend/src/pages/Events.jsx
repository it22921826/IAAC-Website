import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient.js';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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

  const eventsByCategory = monthEvents.reduce((groups, event) => {
    const key = (event.category || 'General').trim() || 'General';
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
    return groups;
  }, {});

  const orderedCategories = ['Academic', 'Workshop', 'Sports', 'Lecture', 'General'];
  const categoryKeys = [
    ...orderedCategories.filter((c) => eventsByCategory[c]?.length),
    ...Object.keys(eventsByCategory)
      .filter((c) => !orderedCategories.includes(c))
      .sort((a, b) => a.localeCompare(b)),
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
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
              <motion.div layout className="space-y-10">
                {categoryKeys.map((category) => (
                  <section key={category}>
                    <div className="flex items-end justify-between mb-5">
                      <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">{category}</h3>
                      <span className="text-xs font-bold text-slate-400">{eventsByCategory[category].length}</span>
                    </div>
                    <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {eventsByCategory[category].map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </motion.div>
                  </section>
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
function EventCard({ event }) {
  const dateObj = event.date;
  if (!dateObj) return null;
  
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const weekday = dateObj.toLocaleString('default', { weekday: 'long' });

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
      <div className="bg-blue-600 px-6 py-3 flex justify-between items-center text-white">
        <span className="text-xs font-bold uppercase tracking-wider">{weekday}</span>
        <span className="text-xs font-medium opacity-80">{event.category || 'General'}</span>
      </div>

      <div className="p-6 flex flex-col flex-grow relative">
        {/* Date Box (Floating) */}
        <div className="absolute top-4 right-6 bg-blue-50 text-blue-700 rounded-xl w-14 h-14 flex flex-col items-center justify-center border border-blue-100 shadow-sm">
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
        <div className="pt-4 border-t border-slate-50 space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-red-400" />
            <span>{event.location || 'Location TBD'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Events;