import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap, BookOpen, Home, Trophy, Menu, Shield } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  const navItems = user?.role === 'STUDENT'
    ? [
        { label: 'Dashboard', icon: Home, path: '/student' },
        { label: 'Available Exams', icon: BookOpen, path: '/student' },
        { label: 'My Results', icon: Trophy, path: '/student' },
      ]
    : [
        { label: 'Dashboard', icon: Home, path: '/teacher' },
        { label: 'Manage Exams', icon: BookOpen, path: '/teacher/manage-exams' },
        { label: 'Create Exam', icon: Home, path: '/teacher/create-exam' },
      ];

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-64 z-50 bg-dark-900/95 backdrop-blur-2xl border-r border-primary-900/40 transition-transform duration-300 pb-6 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 pb-20">
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <Logo className="w-12 h-12 group-hover:scale-105 transition-transform shadow-lg rounded-full" />
            <div>
              <h1 className="text-lg font-bold gradient-text">Learning Point</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Premium Platform</p>
            </div>
          </Link>

          <button onClick={() => nav(user?.role === 'TEACHER' ? '/teacher/create-exam' : '/student')} className="w-full btn btn-primary mb-6">
            <Home className="w-4 h-4" />
            {user?.role === 'TEACHER' ? 'Create Exam' : 'Browse Exams'}
          </button>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-gradient-to-r from-primary-600/30 to-primary-500/20 text-primary-200 border border-primary-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800/60'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-primary-900/40 bg-dark-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-base font-bold shadow-lg">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role === 'STUDENT' ? `Class ${user.classLevel}` : 'Teacher'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full btn btn-secondary text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-dark-950/70 backdrop-blur-xl border-b border-primary-900/40 px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-dark-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 max-w-md mx-auto"></div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-slate-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}