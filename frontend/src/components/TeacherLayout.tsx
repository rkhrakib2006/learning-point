import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, PlusCircle, FileText, Users, BarChart2, Bell, 
  LogOut, X, Menu
} from 'lucide-react';
import Logo from './Logo';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => { await logout(); nav('/login'); };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { name: 'Create Exam', icon: PlusCircle, path: '/teacher/create-exam' },
    { name: 'Manage Exams', icon: FileText, path: '/teacher/manage-exams' },
    { name: 'Students', icon: Users, path: '/teacher/students' },
    { name: 'Results', icon: BarChart2, path: '/teacher/results' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] flex font-sans text-slate-200 overflow-hidden">
      
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0D1326] border-r border-slate-800/50 flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <h1 className="text-lg font-bold text-white tracking-wide">Learning Point</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.name}
                onClick={() => { nav(item.path); setSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800/50 px-4 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white hidden md:block">Teacher Panel</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white">
              <Bell className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800/50 pl-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                {user?.fullName?.charAt(0) || 'R'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-white">{user?.fullName}</p>
                <p className="text-xs text-slate-400">Teacher</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 px-4 py-2 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}