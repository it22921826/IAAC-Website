import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import apiClient from '../services/apiClient.js';

function AdminLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await apiClient.post('/api/admin/login', { email: adminEmail, password });
      const { user, token } = res.data;
      window.localStorage.setItem('iaac_token', token);
      setUser(user);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    let mounted = true;
    async function fetchAdminEmail() {
      try {
        const res = await apiClient.get('/api/admin/config');
        if (mounted && res?.data?.adminEmail) {
          setAdminEmail(res.data.adminEmail);
        }
      } catch (_) {
        // ignore; fallback to env/default
      }
    }
    fetchAdminEmail();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h1>
        <p className="text-sm text-slate-500 mb-4">
          Log in with your admin credentials to access the dashboard.
        </p>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Email</label>
            <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700">
              {adminEmail}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    </section>
  );
}

export default AdminLogin;
