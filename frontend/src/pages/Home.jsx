import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import apiClient from '../services/apiClient.js';

/* ---------------- ANIMATION VARIANTS ---------------- */
const cardVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

function Home() {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeError, setNoticeError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadNotices() {
      try {
        setNoticeLoading(true);
        setNoticeError('');
        const res = await apiClient.get('/api/notices');
        const items = Array.isArray(res.data) ? res.data : res.data?.items;
        if (!isMounted) return;
        setNotices(Array.isArray(items) ? items : []);
      } catch (err) {
        if (!isMounted) return;
        setNotices([]);
        setNoticeError(err?.response?.data?.message || 'Failed to load notices');
      } finally {
        if (!isMounted) return;
        setNoticeLoading(false);
      }
    }

    loadNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayNotices = notices;

  return (
    <>
      {/* HERO */}
      <HeroSection />

      {/* ---------------- NOTICE BOARD ---------------- */}
      <section className="bg-slate-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Bell size={16} />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Notice Board
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Latest Announcements
            </h2>
          </motion.div>

          {/* -------- AUTO-SCROLL HORIZONTAL CAROUSEL -------- */}
          <div className="relative">
            {noticeLoading ? (
              <div className="text-center text-sm text-slate-500 py-10">Loading notices...</div>
            ) : noticeError ? (
              <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {noticeError}
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center text-sm text-slate-500 py-10">No notices published yet.</div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-2">
                {displayNotices.map((notice, index) => {
                  const normalizedNotice = {
                    id: notice._id || notice.id || String(index),
                    title: notice.title || '',
                    description: notice.description || '',
                    image: notice.imageUrl || notice.image || '',
                  };

                  return (
                    <motion.div
                      key={normalizedNotice.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      onClick={() => setSelectedNotice(normalizedNotice)}
                      className="min-w-[300px] max-w-[300px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition"
                    >
                      {/* Image */}
                      <div className="relative h-44">
                        {normalizedNotice.image ? (
                          <img
                            src={normalizedNotice.image}
                            alt={normalizedNotice.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-800 mb-2">
                          {normalizedNotice.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {normalizedNotice.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- MODAL POPUP ---------------- */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white shadow"
              >
                <X size={18} />
              </button>

              {/* Image */}
              <img
                src={selectedNotice.image}
                alt={selectedNotice.title}
                className="w-full h-56 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-extrabold mb-3">
                  {selectedNotice.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {selectedNotice.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;
