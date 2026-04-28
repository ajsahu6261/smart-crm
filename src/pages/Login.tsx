import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Shield, KeyRound, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'staff' | 'client'>('client');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getRoleTheme = () => {
    switch(role) {
      case 'admin': return 'from-indigo-500 to-indigo-700 shadow-indigo-500/20';
      case 'staff': return 'from-teal-500 to-teal-700 shadow-teal-500/20';
      default: return 'from-purple-500 to-purple-700 shadow-purple-500/20';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await axios.post('http://localhost:8000/api/auth/login', formData);
      const user = res.data.user;
      
      if (user.role !== role) {
        setError(`Unauthorized. You are logged in as ${user.role}, but selected ${role} portal.`);
        // Optional: you could just auto-redirect to the correct role
        // login(res.data.access_token, user);
        // navigate(`/${user.role}/dashboard`);
        return;
      }
      
      login(res.data.access_token, user);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError('Invalid credentials or unauthorized access.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr ${getRoleTheme()} opacity-10 blur-3xl pointer-events-none`} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRoleTheme()} flex items-center justify-center text-white mb-4 shadow-lg`}>
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">CA CRM Login</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-4">
            {(['admin', 'staff', 'client'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                  role === r 
                    ? `bg-gradient-to-br ${getRoleTheme()} text-white shadow-md` 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="glass-input w-full pl-10"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="glass-input w-full pl-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`w-full py-3 rounded-xl text-white font-medium shadow-lg transition-all active:scale-95 bg-gradient-to-r ${getRoleTheme()} hover:opacity-90`}>
            Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </button>
        </form>
      </motion.div>
    </div>
  );
};
