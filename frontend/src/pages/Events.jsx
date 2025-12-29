import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient.js';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

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
           <span className="text-blue-500">Events</span>
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
                <EventCard key={e._id} event={e} onClick={() => setSelectedEvent(e)} />
              ))}
              {events.length === 0 && (
                <div className="text-slate-500">No events published yet.</div>
              )}
            </motion.div>
          )}
          {selectedEvent && (
            <EventGalleryModal
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </div>
      </section>
    </>
  );
}

function EventCard({ event, onClick }) {
  const dateFmt = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '';
  return (
    <motion.div
      className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform"
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      onClick={onClick}
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

function EventGalleryModal({ event, onClose }) {
  const dateFmt = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '';
  const images = (Array.isArray(event.imageUrls) && event.imageUrls.length > 0
    ? event.imageUrls
    : [event.imageUrl].filter(Boolean));
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrev = () => {
    if (!images.length) return;
    setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (!images.length) return;
    setCurrentIndex((idx) => (idx + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          aria-label="Close gallery"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">{event.title}</h2>
              {event.description && (
                <p className="mt-1 text-sm text-slate-600 max-w-2xl">{event.description}</p>
              )}
            </div>
            {dateFmt && (
              <span className="px-3 py-1 rounded-full text-xs bg-slate-100 border border-slate-200 text-slate-600 font-medium">
                {dateFmt}
              </span>
            )}
          </div>

          {images.length > 0 ? (
            <div className="space-y-4">
              <div className="relative w-full max-h-[420px] overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center">
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={showPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                )}

                <img
                  src={images[currentIndex]}
                  alt={`${event.title} ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {images.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-16 w-20 md:h-20 md:w-24 rounded-md overflow-hidden border ${
                        idx === currentIndex ? 'border-sky-500 ring-2 ring-sky-300' : 'border-slate-200'
                      } bg-slate-100`}
                    >
                      <img
                        src={url}
                        alt={`${event.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No images available for this event.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UpcomingEvents;
