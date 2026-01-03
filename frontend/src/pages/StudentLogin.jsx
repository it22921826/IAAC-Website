import { useState } from 'react';
import { motion } from 'framer-motion';

function StudentLogin() {
  const [form, setForm] = useState({ email: '', password: '' });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // TODO: Integrate with real student authentication API
    // For now, this is just a placeholder UI.
  };

  return (
    <motion.section
      className="pt-32 sm:pt-[140px] pb-20 bg-slate-50"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-6 max-w-md">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Login</h1>
        <p className="text-slate-600 mb-8">
          Log in to access your student portal. This is a visual placeholder; backend integration can be added later.
        </p>

        <form className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={update('password')}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:brightness-110"
          >
            Log In
          </button>
        </form>
      </div>
    </motion.section>
  );
}

export default StudentLogin;
