import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, ChevronRight, Camera } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import apiClient from '../services/apiClient.js';

function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSession() {
      try {
        const res = await apiClient.get('/api/training-programs');
        const items = res.data.items || [];
        const found = items.find((c) => c._id === sessionId);
        if (mounted) setSession(found);
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchSession();
    return () => { mounted = false; };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-white mb-4">Session Not Found</h1>
        <p className="text-slate-400 mb-8">This session may have been removed or is unavailable.</p>
        <Link
          to="/programs/practical-trainings"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Back to Practical Trainings
        </Link>
      </div>
    );
  }

  // Build gallery from imageUrls and imageUrl
  const gallery = [
    ...(Array.isArray(session.imageUrls) ? session.imageUrls : []),
    ...(session.imageUrl && !(session.imageUrls || []).includes(session.imageUrl) ? [session.imageUrl] : []),
  ].filter(Boolean);

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const nextImage = () => setLightboxIdx((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setLightboxIdx((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title={session.title || session.name || 'Training Session'}
        description={session.description ? session.description.substring(0, 160) : `View details of ${session.title || 'this practical training session'} at IAAC - International Airline and Aviation College.`}
        path={`/programs/session/${sessionId}`}
        keywords={`${session.title || ''}, practical training, aviation session, IAAC training`}
      />

      {/* --- HERO --- */}
      <section className="relative bg-slate-900 pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              to="/programs/practical-trainings"
              className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium"
            >
              <ChevronLeft size={18} /> Back to Practical Trainings
            </Link>

            <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">Practical Training</p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              {session.title || 'Practical Session'}
            </h1>

            {session.shortDescription && (
              <p className="text-lg text-slate-300 max-w-3xl leading-relaxed font-light">
                {session.shortDescription}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- DESCRIPTION --- */}
      {session.shortDescription && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">About This Session</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                  {session.shortDescription}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* --- GALLERY --- */}
      {gallery.length > 0 && (
        <section className="pb-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Camera size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Session Gallery</h2>
                  <p className="text-slate-500 text-sm">{gallery.length} photo{gallery.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((src, idx) => (
                  <motion.div
                    key={idx}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-square"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={() => openLightbox(idx)}
                  >
                    <img
                      src={src}
                      alt={`Session photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Camera size={20} className="text-slate-700" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* --- CTA --- */}
      <section className="bg-slate-900 py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Interested in This Training?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Enroll now to get hands-on experience with our expert instructors and real-world equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apply-now"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Apply Now
              </Link>
              <Link
                to="/contact-us"
                className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/10"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxIdx !== null && gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={gallery[lightboxIdx]}
              alt={`Photo ${lightboxIdx + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 text-white/60 text-sm font-medium">
              {lightboxIdx + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SessionDetails;
