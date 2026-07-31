import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/StatCard';
import { Monitor, CheckCircle, UserCheck, Wrench, AlertTriangle, Users, Activity, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get('/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div class="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h2>
        <p class="text-xs text-slate-400 mt-1">Real-time overview of organization assets and workforce assignments.</p>
      </div>

      {/* Grid Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Assets" value={stats?.totalAssets || 0} icon={Monitor} color="indigo" subtext="All inventory" />
        <StatCard title="Available" value={stats?.availableAssets || 0} icon={CheckCircle} color="emerald" subtext="Ready to assign" />
        <StatCard title="Assigned" value={stats?.assignedAssets || 0} icon={UserCheck} color="blue" subtext="In active use" />
        <StatCard title="Maintenance" value={stats?.maintenanceAssets || 0} icon={Wrench} color="amber" subtext="Under repair" />
        <StatCard title="Broken" value={stats?.brokenAssets || 0} icon={AlertTriangle} color="rose" subtext="Decommissioned" />
        <StatCard title="Employees" value={stats?.totalEmployees || 0} icon={Users} color="indigo" subtext="Active staff" />
      </div>

      {/* Recent Activity Table */}
      <div class="glass-card rounded-2xl border border-slate-800 p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <Activity size={18} class="text-indigo-400" />
            <h3 class="text-base font-semibold text-white">Recent Assignment History</h3>
          </div>
          <span class="text-xs text-slate-400">Last 5 Activities</span>
        </div>

        {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
          <div class="text-center py-8 text-slate-500 text-sm">No assignment history recorded yet.</div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th class="py-3.5 px-4 font-semibold">Asset Name</th>
                  <th class="py-3.5 px-4 font-semibold">Asset ID</th>
                  <th class="py-3.5 px-4 font-semibold">Assigned To</th>
                  <th class="py-3.5 px-4 font-semibold">Assigned Date</th>
                  <th class="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                {stats.recentActivity.map((log) => (
                  <tr key={log._id} class="hover:bg-slate-800/30 transition">
                    <td class="py-3.5 px-4 font-medium text-white">{log.asset?.assetName || 'N/A'}</td>
                    <td class="py-3.5 px-4 text-xs font-mono text-indigo-400">{log.asset?.assetId || 'N/A'}</td>
                    <td class="py-3.5 px-4">
                      {log.employee ? (
                        <div>
                          <p class="font-medium text-slate-200">{log.employee.name}</p>
                          <p class="text-xs text-slate-500">{log.employee.department}</p>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td class="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(log.assignedDate).toLocaleDateString()}
                    </td>
                    <td class="py-3.5 px-4">
                      {log.returnedDate ? (
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          <Clock size={12} /> Returned
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle size={12} /> Active Assignment
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
