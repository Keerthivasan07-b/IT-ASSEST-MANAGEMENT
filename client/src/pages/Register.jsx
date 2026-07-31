import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Laptop, Lock, Mail, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Backend server disconnected. Please ensure Node server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40">
      <div class="glass-card w-full max-w-md p-8 rounded-3xl border border-slate-800 shadow-2xl glow-purple">
        <div class="text-center mb-8">
          <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center text-white shadow-xl mb-4">
            <Laptop size={28} />
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Create Account</h2>
          <p class="text-sm text-slate-400 mt-1">Register new administrator or manager</p>
        </div>

        {error && (
          <div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} class="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
            <div class="relative">
              <User size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                class="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <div class="relative">
              <Mail size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@company.com"
                class="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <div class="relative">
              <Lock size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                class="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Role</label>
            <div class="relative">
              <Shield size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                class="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none transition"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition duration-200 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <p class="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" class="text-indigo-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
