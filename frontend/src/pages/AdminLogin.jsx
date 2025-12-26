import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function AdminLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setUser({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    });
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h1>
        <p className="text-sm text-slate-500 mb-4">
          This temporary screen lets you log in as an admin to preview the dashboard.
        </p>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login as Admin
        </button>
      </div>
    </section>
  );
}

export default AdminLogin;
