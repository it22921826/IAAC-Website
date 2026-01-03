import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, ChevronLeft, Search, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient.js';

// --- HELPER FUNCTIONS ---
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

const Events = () => {
  const [events, setEvents] = useState([]); // Empty array initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentDate, setCurrentDate] = useState(new Date()); // Start at today
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('All');

  // --- 1. FETCH DATA FROM BACKEND ---
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
          return {
            ...event,
            date,
          };
        });

        if (!isMounted) return;
        setEvents(formattedData);
      } catch (err) {
        console.error("Failed to fetch events", err);
        if (!isMounted) return;
        setEvents([]);
        setError(err?.response?.data?.message || 'Failed to load events');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- CALENDAR LOGIC (Same as before) ---
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  // --- FILTER LOGIC (Updated to use 'events' state) ---
  const filteredEvents = events.filter(event => {
    if (filter !== 'All' && event.category !== filter) return false;
    if (!event.date) return false;
    
    if (selectedDate) {
      return (
        event.date.getDate() === selectedDate &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
      );
    }
    // If no date selected, show all UPCOMING events for this month
    return (
       event.date.getMonth() === currentDate.getMonth() &&
       event.date.getFullYear() === currentDate.getFullYear()
    );
  }).sort((a, b) => a.date - b.date);

  const hasEvent = (day) => {
    return events.some(e => 
      e.date &&
      e.date.getDate() === day && 
      e.date.getMonth() === currentDate.getMonth() &&
      e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* HEADER */}
      <div className="bg-slate-900 text-white py-12 mb-10">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 initial={{opacity:0}} animate={{opacity:1}} className="text-4xl font-bold mb-4">Events Calendar</motion.h1>
          <p className="text-slate-400">Keep track of workshops, lectures, and student activities.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10">
        
        {/* LEFT: CALENDAR */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-slate-800">{monthName} {year}</h2>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => (
                <div key={idx} className="aspect-square relative">
                  {day && (
                    <button
                      onClick={() => setSelectedDate(selectedDate === day ? null : day)}
                      className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200
                        ${selectedDate === day ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-50 text-slate-700 bg-slate-50'}
                        ${hasEvent(day) ? 'font-bold border border-blue-200' : ''}
                      `}
                    >
                      {day}
                      {hasEvent(day) && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 ${selectedDate === day ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: EVENT LIST */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {error && (
              <div className="text-center py-4 text-red-600 bg-red-50 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            <AnimatePresence mode='popLayout'>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event._id} event={event} /> // Use _id for Mongo keys
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed">
                  No events found for this selection.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SINGLE EVENT CARD ---
function EventCard({ event }) {
  const dateObj = event.date; // Normalized Date object (or null)
  if (!dateObj) {
    return null;
  }
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6"
    >
      <div className="shrink-0 flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-xl w-20 h-20 border border-blue-100">
        <span className="text-xs font-bold uppercase">{month}</span>
        <span className="text-3xl font-extrabold">{day}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
        <p className="text-slate-600 text-sm mt-1">{event.description}</p>
        <div className="mt-3 flex gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-4" /> {event.time || 'TBA'}</span>
          <span className="flex items-center gap-1"><MapPin className="w-4" /> {event.location || 'TBA'}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default Events;