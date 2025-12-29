import { motion } from 'framer-motion';

function AcademicStaff() {
  return (
    <motion.section
      className="py-16 bg-white scroll-mt-[140px]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Academic Staff
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          Meet the dedicated academic team behind IAAC. This page can be expanded
          to showcase detailed profiles, qualifications, and experience of our
          lecturers and instructors.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
          Academic staff details will be added here.
        </div>
      </div>
    </motion.section>
  );
}

export default AcademicStaff;
