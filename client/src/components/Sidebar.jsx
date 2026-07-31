import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Monitor, Users, History } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assets', label: 'Assets Management', icon: Monitor },
    { path: '/employees', label: 'Employee Directory', icon: Users },
    { path: '/history', label: 'Asset History', icon: History },
  ];

  return (
    <aside class="w-64 border-r border-slate-800/80 bg-slate-900/60 p-4 flex flex-col justify-between shrink-0">
      <div class="space-y-1">
        <p class="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div class="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/20 text-xs text-slate-400">
        <p class="font-medium text-indigo-300 mb-1">MERN Asset Manager</p>
        <p class="text-[11px] leading-relaxed text-slate-500">Track hardware, software licenses, & employee assignments in real-time.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
