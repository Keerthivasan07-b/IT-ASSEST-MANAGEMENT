import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Laptop, UserCheck, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header class="glass-nav sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg glow-purple">
          <Laptop size={22} />
        </div>
        <div>
          <h1 class="text-lg font-bold text-white tracking-wide">IT Asset Manager</h1>
          <p class="text-xs text-slate-400">Enterprise Hardware & Software Tracking</p>
        </div>
      </div>

      {user && (
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 px-3.5 py-1.5 rounded-xl">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div class="text-left">
              <p class="text-xs font-semibold text-slate-200">{user.name}</p>
              <div class="flex items-center gap-1">
                <Shield size={10} class="text-indigo-400" />
                <span class="text-[10px] text-slate-400 uppercase tracking-wider">{user.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            class="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800/40 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 px-3.5 py-2 rounded-xl transition-all duration-200"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
