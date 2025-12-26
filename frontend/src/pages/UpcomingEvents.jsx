import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient.js';
import { motion } from 'framer-motion';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiClient.get('/api/events');
        if (mounted) {
          setEvents(res.data.items || []);
          setError('');
        }
      } catch (err) {
        if (mounted) setError('Unable to load events');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="bg-slate-900 pt-[160px] pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Upcoming <span className="text-blue-500">Events</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Latest events published by IAAC.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {loading && <div className="text-slate-500">Loading events...</div>}
          {!loading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
          )}
          {!loading && !error && (
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            >
              {events.map((e) => (
                <EventCard key={e._id} event={e} />
              ))}
              {events.length === 0 && (
                <div className="text-slate-500">No events published yet.</div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

function EventCard({ event }) {
  const dateFmt = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '';
  return (
    <motion.div
      className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
    >
      {event.imageUrl && (
        <div className="h-44 w-full overflow-hidden bg-slate-200">
          <img src={event.imageUrl} alt={event.title}
            className="w-full h-full object-cover" onError={(e)=>{ e.target.style.display='none'; }} />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
          {dateFmt && (
            <span className="px-2 py-1 rounded-full text-xs bg-white border border-slate-200 text-slate-600">{dateFmt}</span>
          )}
        </div>
        {event.description && (
          <p className="text-sm text-slate-600">{event.description}</p>
        )}
      </div>
    </motion.div>
  );
}

export default UpcomingEvents;
