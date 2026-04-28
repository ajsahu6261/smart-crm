import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Hello, {user?.full_name}</h1>
        <p className="text-slate-500">Track your service status and documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Documents Required" value="2" icon={FileText} color="purple" />
        <StatCard title="In Progress Services" value="1" icon={Clock} color="orange" />
        <StatCard title="Completed Services" value="4" icon={CheckCircle} color="green" />
      </div>

      <div className="glass-panel p-6 mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Service Timeline</h2>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          
          <TimelineItem 
            title="ITR Filing 2024-25" 
            status="In Progress"
            date="Today"
            description="Our team is reviewing your uploaded Form 16."
            isActive={true}
          />
          <TimelineItem 
            title="GST Return (March)" 
            status="Completed"
            date="Apr 15, 2026"
            description="GST return successfully filed."
            isActive={false}
          />

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
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

const TimelineItem = ({ title, status, date, description, isActive }: any) => (
  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${isActive ? 'bg-purple-500 shadow-md' : 'bg-slate-300'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
      {isActive ? <Clock size={16} className="text-white" /> : <CheckCircle size={16} className="text-white" />}
    </div>
    
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <time className="text-xs font-medium text-slate-500">{date}</time>
      </div>
      <div className="text-sm text-slate-600 mb-2">{description}</div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isActive ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
        {status}
      </span>
    </div>
  </div>
);
