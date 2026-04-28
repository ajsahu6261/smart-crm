import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, X, Shield, Mail, User } from 'lucide-react';
import axios from 'axios';

interface StaffUser {
  _id?: string;
  id?: string;
  full_name: string;
  email: string;
  role: string;
}

export const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'staff',
    password: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter for staff only, or show all if needed
      setStaff(response.data.filter((u: StaffUser) => u.role === 'staff' || u.role === 'admin'));
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingStaff) {
        await axios.put(`${API_URL}/auth/users/${editingStaff.id || editingStaff._id}`, {
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/auth/register`, {
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          password: formData.password
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      setEditingStaff(null);
      setFormData({ full_name: '', email: '', role: 'staff', password: '' });
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleEdit = (user: StaffUser) => {
    setEditingStaff(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: '' // Don't show password
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const filteredStaff = staff.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-slate-500">Manage firm employees and their access levels.</p>
        </div>
        <button 
          onClick={() => {
            setEditingStaff(null);
            setFormData({ full_name: '', email: '', role: 'staff', password: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-teal-200"
        >
          <UserPlus size={20} />
          Add Staff Member
        </button>
      </div>

      <div className="glass-panel p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search staff by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading staff...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No staff members found.</div>
        ) : (
          filteredStaff.map((user) => (
            <motion.div 
              layout
              key={user.id || user._id}
              className="glass-card p-6 flex flex-col items-center text-center group relative"
            >
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(user)}
                  className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete((user.id || user._id)!)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 ${
                user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
              }`}>
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{user.full_name}</h3>
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                <Mail size={14} /> {user.email}
              </p>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
              }`}>
                {user.role}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={16} /> Email Address
                  </label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {!editingStaff && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Initial Password</label>
                    <input 
                      required
                      type="password" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Shield size={16} /> Role
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                  >
                    {editingStaff ? 'Save Changes' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
