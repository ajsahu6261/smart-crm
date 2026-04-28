import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckSquare, AlertCircle } from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.full_name}</h1>
        <p className="text-slate-500">Here's your tasks overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Pending Tasks" value="12" icon={Clock} color="orange" />
        <StatCard title="In Progress" value="5" icon={AlertCircle} color="blue" />
        <StatCard title="Completed Today" value="8" icon={CheckSquare} color="green" />
      </div>

      <div className="glass-panel p-6 mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Client Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100">
              <div>
                <p className="font-medium text-slate-800">Acme Corp - GST Filing</p>
                <p className="text-sm text-slate-500">Document uploaded by client</p>
              </div>
              <span className="text-sm text-slate-400">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
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
