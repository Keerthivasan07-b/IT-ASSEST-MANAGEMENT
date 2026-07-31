import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { History as HistoryIcon, Clock, CheckCircle, Monitor } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assets/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h2 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <HistoryIcon class="text-indigo-400" />
          <span>Asset Assignment History</span>
        </h2>
        <p class="text-xs text-slate-400 mt-1">Audit log tracking every hardware assignment and return timestamp.</p>
      </div>

      <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div class="flex items-center justify-center h-48">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div class="text-center py-12 text-slate-500 text-sm">No assignment records found.</div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th class="py-3.5 px-4 font-semibold">Asset ID</th>
                  <th class="py-3.5 px-4 font-semibold">Asset Name</th>
                  <th class="py-3.5 px-4 font-semibold">Employee</th>
                  <th class="py-3.5 px-4 font-semibold">Assigned Date</th>
                  <th class="py-3.5 px-4 font-semibold">Returned Date</th>
                  <th class="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                {history.map((item) => (
                  <tr key={item._id} class="hover:bg-slate-800/30 transition">
                    <td class="py-3.5 px-4 font-mono text-xs text-indigo-400 font-semibold">
                      {item.asset?.assetId || 'N/A'}
                    </td>
                    <td class="py-3.5 px-4">
                      <p class="font-medium text-white">{item.asset?.assetName || 'Deleted Asset'}</p>
                      <p class="text-[10px] text-slate-500">{item.asset?.category}</p>
                    </td>
                    <td class="py-3.5 px-4">
                      {item.employee ? (
                        <div>
                          <p class="font-medium text-slate-200">{item.employee.name}</p>
                          <p class="text-xs text-slate-500">{item.employee.department} ({item.employee.employeeId})</p>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td class="py-3.5 px-4 text-xs text-slate-300">
                      {new Date(item.assignedDate).toLocaleString()}
                    </td>
                    <td class="py-3.5 px-4 text-xs text-slate-400">
                      {item.returnedDate ? new Date(item.returnedDate).toLocaleString() : <span class="text-emerald-400 font-medium">Currently Held</span>}
                    </td>
                    <td class="py-3.5 px-4">
                      {item.returnedDate ? (
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

export default History;
