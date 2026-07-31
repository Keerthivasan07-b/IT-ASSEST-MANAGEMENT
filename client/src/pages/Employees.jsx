import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Plus, UserCheck, Edit, Trash2, Mail, Phone, Building, Briefcase } from 'lucide-react';

const Employees = () => {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    department: '',
    designation: '',
    email: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await API.post('/employees', formData);
      if (res.data.success) {
        setSuccess('Employee added successfully!');
        setIsAddModalOpen(false);
        resetForm();
        fetchEmployees();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee.');
    }
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      employeeId: emp.employeeId,
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      email: emp.email,
      phone: emp.phone
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.put(`/employees/${selectedEmployee._id}`, formData);
      if (res.data.success) {
        setSuccess('Employee updated successfully!');
        setIsEditModalOpen(false);
        resetForm();
        fetchEmployees();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee.');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await API.delete(`/employees/${id}`);
      if (res.data.success) {
        setSuccess('Employee deleted successfully.');
        fetchEmployees();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee.');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      department: '',
      designation: '',
      email: '',
      phone: ''
    });
    setSelectedEmployee(null);
  };

  return (
    <div class="space-y-6 animate-fadeIn">
      {/* Top Header & Action */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Employee Directory</h2>
          <p class="text-xs text-slate-400 mt-1">Manage corporate staff, departments, and asset allocations.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition duration-200"
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {success && (
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} class="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Table */}
      <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div class="flex items-center justify-center h-48">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : employees.length === 0 ? (
          <div class="text-center py-12 text-slate-500 text-sm">No employees registered in the system.</div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th class="py-3.5 px-4 font-semibold">Emp ID</th>
                  <th class="py-3.5 px-4 font-semibold">Employee Name</th>
                  <th class="py-3.5 px-4 font-semibold">Department</th>
                  <th class="py-3.5 px-4 font-semibold">Designation</th>
                  <th class="py-3.5 px-4 font-semibold">Email</th>
                  <th class="py-3.5 px-4 font-semibold">Phone</th>
                  {isAdmin && <th class="py-3.5 px-4 font-semibold text-right">Actions</th>}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                {employees.map((emp) => (
                  <tr key={emp._id} class="hover:bg-slate-800/30 transition">
                    <td class="py-3.5 px-4 font-mono text-xs font-semibold text-indigo-400">{emp.employeeId}</td>
                    <td class="py-3.5 px-4 font-medium text-white">{emp.name}</td>
                    <td class="py-3.5 px-4 text-xs text-slate-300">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                        <Building size={12} class="text-indigo-400" /> {emp.department}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-xs text-slate-400">{emp.designation}</td>
                    <td class="py-3.5 px-4 text-xs text-slate-300">
                      <span class="inline-flex items-center gap-1.5">
                        <Mail size={12} class="text-slate-500" /> {emp.email}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-xs text-slate-400">{emp.phone}</td>
                    {isAdmin && (
                      <td class="py-3.5 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            title="Edit Employee"
                            class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp._id)}
                            title="Delete Employee"
                            class="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleCreateEmployee} class="space-y-4">
          {error && <div class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Employee ID *</label>
              <input type="text" name="employeeId" required placeholder="EMP-101" value={formData.employeeId} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
              <input type="text" name="name" required placeholder="Sarah Jenkins" value={formData.name} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Department *</label>
              <input type="text" name="department" required placeholder="Engineering / Marketing" value={formData.department} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Designation *</label>
              <input type="text" name="designation" required placeholder="Software Engineer" value={formData.designation} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input type="email" name="email" required placeholder="sarah@company.com" value={formData.email} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
              <input type="text" name="phone" required placeholder="+1 555-0199" value={formData.phone} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <button type="submit" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition">
            Save Employee
          </button>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee">
        <form onSubmit={handleUpdateEmployee} class="space-y-4">
          {error && <div class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Employee ID</label>
              <input type="text" name="employeeId" disabled value={formData.employeeId} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Department *</label>
              <input type="text" name="department" required value={formData.department} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Designation *</label>
              <input type="text" name="designation" required value={formData.designation} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <button type="submit" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition">
            Update Employee
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
