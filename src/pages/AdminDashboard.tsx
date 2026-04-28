import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';

const staticData = [
  { name: 'Jan', ITR: 40, GST: 24, TDS: 24, Audit: 10 },
  { name: 'Feb', ITR: 30, GST: 13, TDS: 22, Audit: 15 },
  { name: 'Mar', ITR: 20, GST: 38, TDS: 22, Audit: 20 },
  { name: 'Apr', ITR: 27, GST: 39, TDS: 20, Audit: 25 },
  { name: 'May', ITR: 18, GST: 48, TDS: 21, Audit: 30 },
  { name: 'Jun', ITR: 23, GST: 38, TDS: 25, Audit: 35 },
];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    clients: 0,
    tasks: 0,
    completed: 0,
    growth: '+0%'
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [clientsRes, tasksRes] = await Promise.all([
          axios.get(`${API_URL}/records/clients`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/records/tasks`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const completedTasks = tasksRes.data.filter((t: any) => t.status === 'Done').length;
        
        setStats({
          clients: clientsRes.data.length,
          tasks: tasksRes.data.length,
          completed: completedTasks,
          growth: '+14%' // Static for now as per design
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
          <p className="text-slate-500">Monitor firm performance and task status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clients" value={stats.clients.toString()} icon={Users} color="indigo" />
        <StatCard title="Active Tasks" value={stats.tasks.toString()} icon={FileText} color="blue" />
        <StatCard title="Completed Tasks" value={stats.completed.toString()} icon={CheckCircle} color="teal" />
        <StatCard title="Revenue Growth" value={stats.growth} icon={TrendingUp} color="emerald" />
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Service Trends</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staticData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="ITR" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
              <Bar dataKey="GST" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="TDS" stackId="a" fill="#0ea5e9" />
              <Bar dataKey="Audit" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex items-center gap-4"
    >
      <div className={`p-4 rounded-xl ${colorMap[color] || 'bg-slate-50 text-slate-600'}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </motion.div>
  );
};
