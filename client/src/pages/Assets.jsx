import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Plus, Search, Filter, Edit, Trash2, UserPlus, RotateCcw, Monitor, CheckCircle, AlertTriangle, Wrench, XCircle } from 'lucide-react';

const Assets = () => {
  const { isAdmin } = useAuth();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Selected Asset for Edit/Assign
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Forms State
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    category: 'Laptop',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyExpiry: '',
    price: '',
    status: 'Available'
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, [search, statusFilter]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/assets', { params });
      if (res.data.success) {
        setAssets(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await API.post('/assets', formData);
      if (res.data.success) {
        setSuccess('Asset added successfully!');
        setIsAddModalOpen(false);
        resetForm();
        fetchAssets();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add asset.');
    }
  };

  const handleOpenEdit = (asset) => {
    setSelectedAsset(asset);
    setFormData({
      assetId: asset.assetId,
      assetName: asset.assetName,
      category: asset.category,
      brand: asset.brand,
      model: asset.model || '',
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.split('T')[0] : '',
      price: asset.price,
      status: asset.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.put(`/assets/${selectedAsset._id}`, formData);
      if (res.data.success) {
        setSuccess('Asset updated successfully!');
        setIsEditModalOpen(false);
        resetForm();
        fetchAssets();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update asset.');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      const res = await API.delete(`/assets/${id}`);
      if (res.data.success) {
        setSuccess('Asset deleted successfully.');
        fetchAssets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete asset.');
    }
  };

  const handleOpenAssign = (asset) => {
    setSelectedAsset(asset);
    setSelectedEmployeeId('');
    setIsAssignModalOpen(true);
  };

  const handleAssignAsset = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setError('Please select an employee.');
      return;
    }
    setError('');
    try {
      const res = await API.post('/assets/assign', {
        assetId: selectedAsset._id,
        employeeId: selectedEmployeeId
      });
      if (res.data.success) {
        setSuccess(res.data.message);
        setIsAssignModalOpen(false);
        fetchAssets();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign asset.');
    }
  };

  const handleReturnAsset = async (assetId) => {
    if (!window.confirm('Return this asset back to inventory?')) return;
    try {
      const res = await API.post('/assets/return', { assetId });
      if (res.data.success) {
        setSuccess(res.data.message);
        fetchAssets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to return asset.');
    }
  };

  const resetForm = () => {
    setFormData({
      assetId: '',
      assetName: '',
      category: 'Laptop',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyExpiry: '',
      price: '',
      status: 'Available'
    });
    setSelectedAsset(null);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle size={12} /> Available
          </span>
        );
      case 'Assigned':
        return (
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Monitor size={12} /> Assigned
          </span>
        );
      case 'Maintenance':
        return (
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Wrench size={12} /> Maintenance
          </span>
        );
      case 'Broken':
        return (
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle size={12} /> Broken
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div class="space-y-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">IT Asset Inventory</h2>
          <p class="text-xs text-slate-400 mt-1">Manage laptops, monitors, software licenses, & hardware components.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition duration-200"
          >
            <Plus size={18} />
            <span>Add Asset</span>
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

      {/* Filter and Search Bar */}
      <div class="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div class="relative w-full sm:w-80">
          <Search size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, ID, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            class="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} class="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            class="w-full sm:w-48 bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-sm text-white outline-none transition"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Broken">Broken</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div class="flex items-center justify-center h-48">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : assets.length === 0 ? (
          <div class="text-center py-12 text-slate-500 text-sm">No assets found matching your criteria.</div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th class="py-3.5 px-4 font-semibold">Asset ID</th>
                  <th class="py-3.5 px-4 font-semibold">Asset Name</th>
                  <th class="py-3.5 px-4 font-semibold">Category</th>
                  <th class="py-3.5 px-4 font-semibold">Brand / Model</th>
                  <th class="py-3.5 px-4 font-semibold">Price</th>
                  <th class="py-3.5 px-4 font-semibold">Status</th>
                  <th class="py-3.5 px-4 font-semibold">Assigned To</th>
                  {isAdmin && <th class="py-3.5 px-4 font-semibold text-right">Actions</th>}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                {assets.map((asset) => (
                  <tr key={asset._id} class="hover:bg-slate-800/30 transition">
                    <td class="py-3.5 px-4 font-mono text-xs font-semibold text-indigo-400">{asset.assetId}</td>
                    <td class="py-3.5 px-4 font-medium text-white">{asset.assetName}</td>
                    <td class="py-3.5 px-4 text-xs text-slate-400">{asset.category}</td>
                    <td class="py-3.5 px-4 text-xs text-slate-300">{asset.brand} {asset.model}</td>
                    <td class="py-3.5 px-4 font-mono text-xs text-emerald-400">${asset.price}</td>
                    <td class="py-3.5 px-4">{renderStatusBadge(asset.status)}</td>
                    <td class="py-3.5 px-4">
                      {asset.assignedTo ? (
                        <div>
                          <p class="font-medium text-slate-200 text-xs">{asset.assignedTo.name}</p>
                          <p class="text-[10px] text-slate-500">{asset.assignedTo.employeeId}</p>
                        </div>
                      ) : (
                        <span class="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td class="py-3.5 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          {asset.status === 'Available' && (
                            <button
                              onClick={() => handleOpenAssign(asset)}
                              title="Assign Asset"
                              class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition"
                            >
                              <UserPlus size={15} />
                            </button>
                          )}
                          {asset.status === 'Assigned' && (
                            <button
                              onClick={() => handleReturnAsset(asset._id)}
                              title="Return Asset"
                              class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(asset)}
                            title="Edit Asset"
                            class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset._id)}
                            title="Delete Asset"
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

      {/* Add Asset Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Asset">
        <form onSubmit={handleCreateAsset} class="space-y-4">
          {error && <div class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Asset ID *</label>
              <input type="text" name="assetId" required placeholder="AST-1001" value={formData.assetId} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Asset Name *</label>
              <input type="text" name="assetName" required placeholder="Dell XPS 15" value={formData.assetName} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500">
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Software License">Software License</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Brand *</label>
              <input type="text" name="brand" required placeholder="Dell, Apple, HP..." value={formData.brand} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Model</label>
              <input type="text" name="model" placeholder="Latitude 5410" value={formData.model} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Serial Number</label>
              <input type="text" name="serialNumber" placeholder="SN-882391" value={formData.serialNumber} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Price ($) *</label>
              <input type="number" name="price" required min="0" placeholder="1200" value={formData.price} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Purchase Date *</label>
              <input type="date" name="purchaseDate" required value={formData.purchaseDate} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Warranty Expiry</label>
              <input type="date" name="warrantyExpiry" value={formData.warrantyExpiry} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500">
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Broken">Broken</option>
            </select>
          </div>
          <button type="submit" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition">
            Save Asset
          </button>
        </form>
      </Modal>

      {/* Edit Asset Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Asset">
        <form onSubmit={handleUpdateAsset} class="space-y-4">
          {error && <div class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Asset ID</label>
              <input type="text" name="assetId" disabled value={formData.assetId} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Asset Name *</label>
              <input type="text" name="assetName" required value={formData.assetName} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Brand *</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Price ($) *</label>
              <input type="number" name="price" required value={formData.price} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500">
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Broken">Broken</option>
            </select>
          </div>
          <button type="submit" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition">
            Update Asset
          </button>
        </form>
      </Modal>

      {/* Assign Asset Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign ${selectedAsset?.assetName}`}>
        <form onSubmit={handleAssignAsset} class="space-y-4">
          {error && <div class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}
          <div>
            <p class="text-xs text-slate-400 mb-3">Select employee to assign asset <span class="text-indigo-400 font-mono font-semibold">{selectedAsset?.assetId}</span>:</p>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeId}) - {emp.department}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition">
            Confirm Assignment
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Assets;
