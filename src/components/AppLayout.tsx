import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileText, Settings, 
  LogOut, Menu, X, CheckSquare, Bell, User as UserIcon
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleColor = () => {
    if (user.role === 'admin') return 'text-indigo-600 bg-indigo-50';
    if (user.role === 'staff') return 'text-teal-600 bg-teal-50';
    return 'text-purple-600 bg-purple-50';
  };

  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { name: 'Clients', icon: Users, path: '/admin/clients' },
      { name: 'Staff', icon: UserIcon, path: '/admin/staff' },
      { name: 'ITR', icon: FileText, path: '/admin/itr' },
      { name: 'GST', icon: FileText, path: '/admin/gst' },
      { name: 'TDS', icon: FileText, path: '/admin/tds' },
      { name: 'Audit', icon: FileText, path: '/admin/audit' },
      { name: 'Billing', icon: FileText, path: '/admin/billing' },
      { name: 'Documents', icon: FileText, path: '/admin/documents' },
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
    staff: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/staff/dashboard' },
      { name: 'My Clients', icon: Users, path: '/staff/clients' },
      { name: 'ITR', icon: FileText, path: '/staff/itr' },
      { name: 'GST', icon: FileText, path: '/staff/gst' },
      { name: 'TDS', icon: FileText, path: '/staff/tds' },
      { name: 'Audit', icon: FileText, path: '/staff/audit' },
      { name: 'Billing', icon: FileText, path: '/staff/billing' },
      { name: 'Kanban Board', icon: CheckSquare, path: '/staff/kanban' },
      { name: 'Documents', icon: FileText, path: '/staff/documents' },
    ],
    client: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
      { name: 'My Status', icon: FileText, path: '/client/status' },
      { name: 'My Documents', icon: FileText, path: '/client/documents' },
      { name: 'Profile', icon: UserIcon, path: '/client/profile' },
    ]
  };

  const currentMenu = menuItems[user.role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 relative"
          >
            <div className="p-6 flex items-center gap-2 font-bold text-xl text-slate-800">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRoleColor()}`}>
                {user.role.charAt(0).toUpperCase()}
              </div>
              CA Firm<span className="text-slate-400 font-normal">Pro</span>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {currentMenu.map((item) => {
                const isActive = location.pathname.includes(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? getRoleColor() + ' shadow-sm font-medium' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? '' : 'opacity-70'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${getRoleColor()}`}>
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
