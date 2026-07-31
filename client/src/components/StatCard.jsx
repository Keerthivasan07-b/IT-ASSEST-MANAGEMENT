import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtext }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
    blue: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30'
  };

  const iconBgMap = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400',
    blue: 'bg-sky-500/20 text-sky-400'
  };

  return (
    <div class={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${colorMap[color] || colorMap.indigo} transition-all duration-300 hover:scale-[1.02]`}>
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div class={`p-2.5 rounded-xl ${iconBgMap[color] || iconBgMap.indigo}`}>
          <Icon size={20} />
        </div>
      </div>
      <div class="text-2xl font-bold text-white tracking-tight">{value}</div>
      {subtext && <p class="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
};

export default StatCard;
