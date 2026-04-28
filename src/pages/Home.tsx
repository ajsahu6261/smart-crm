import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Briefcase, FileText, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/20 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <nav className="flex justify-between items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-slate-800 flex items-center gap-2"
          >
            <ShieldCheck className="text-indigo-600" size={32} />
            CA Firm<span className="text-indigo-600">Pro</span>
          </motion.div>
          <div className="space-x-4">
            <Link to="/login?role=client" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Client Portal</Link>
          </div>
        </nav>

        <main className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Modernizing <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
                Tax & Audit
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Experience a seamless, secure, and intuitive platform for all your financial compliance needs. ITR, GST, TDS, and Audits managed effortlessly.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Link to="/login?role=client" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg">
                Get Started <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 grid grid-cols-2 gap-6 w-full max-w-lg"
          >
            <Card icon={<Users className="text-indigo-500" size={32}/>} title="Admin Access" link="/login?role=admin" delay={0.3} color="border-indigo-100 bg-indigo-50/50" />
            <Card icon={<Briefcase className="text-teal-500" size={32}/>} title="Staff Portal" link="/login?role=staff" delay={0.4} color="border-teal-100 bg-teal-50/50" />
            <Card icon={<FileText className="text-purple-500" size={32}/>} title="Client Services" link="/login?role=client" delay={0.5} color="border-purple-100 bg-purple-50/50" className="col-span-2" />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const Card = ({ icon, title, link, delay, color, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className={`glass-card p-6 flex flex-col items-center justify-center gap-4 cursor-pointer border ${color} ${className}`}
  >
    <Link to={link} className="flex flex-col items-center justify-center w-full h-full gap-3">
      <div className="p-4 bg-white rounded-2xl shadow-sm">{icon}</div>
      <span className="font-semibold text-slate-700">{title}</span>
    </Link>
  </motion.div>
);
