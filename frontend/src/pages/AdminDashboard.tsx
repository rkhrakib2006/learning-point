import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { Shield, Trash2, Key, Users, LogOut, CheckCircle2, AlertCircle, X, BookOpen, UserCheck, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'teachers' | 'students'>('pending');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const loadUsers = () => {
    api.get('/admin/users').then(res => setUsers(res.data.users)).catch(() => {});
  };

  useEffect(() => { loadUsers(); }, []);

  const showNotification = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = async (email: string, code: string) => {
    if (!code || code.trim() === '') return showNotification('err', 'Please enter a valid code');
    try {
      await api.post('/admin/set-access-code', { email, code });
      await api.patch(`/admin/approve-user/${email}`); // নতুন API
      showNotification('ok', `User approved with code: ${code}`);
      loadUsers();
    } catch { showNotification('err', 'Failed to approve user'); }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      await api.post('/admin/clear-data');
      showNotification('ok', 'All exam data cleared!');
      setShowClearModal(false);
    } catch { showNotification('err', 'Failed to clear data'); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await logout(); nav('/login'); };

  const pendingUsers = users.filter(u => !u.isActive);
  const teachers = users.filter(u => u.role === 'TEACHER' && u.isActive);
  const students = users.filter(u => u.role === 'STUDENT' && u.isActive);

  return (
    <div className="min-h-screen bg-[#06120E] flex relative font-sans text-slate-200">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${toast.type === 'ok' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400' : 'bg-red-950 border-red-500/50 text-red-400'}`}>
          {toast.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}

      {/* Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A1A14] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center relative">
            <button onClick={() => setShowClearModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Clear All Data?</h3>
            <p className="text-slate-400 mb-6">This will delete ALL exams and results. User accounts will remain.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowClearModal(false)} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white">Cancel</button>
              <button onClick={handleClearData} disabled={loading} className="px-6 py-2.5 rounded-xl bg-red-600 text-white">{loading ? 'Clearing...' : 'Yes, Clear Data'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1A14] border-r border-emerald-900/30 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-emerald-900/30">
          <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2"><Shield /> Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('pending')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === 'pending' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-emerald-900/20'}`}>
            <div className="flex items-center gap-3"><UserCheck className="w-5 h-5"/> Pending Approvals</div>
            {pendingUsers.length > 0 && <span className="bg-emerald-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{pendingUsers.length}</span>}
          </button>
          <button onClick={() => setActiveTab('teachers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'teachers' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-emerald-900/20'}`}>
            <BookOpen className="w-5 h-5"/> Teachers
          </button>
          <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'students' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-emerald-900/20'}`}>
            <Users className="w-5 h-5"/> Students
          </button>
        </nav>
        <div className="p-4 border-t border-emerald-900/30">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-950/50 rounded-xl text-red-400 hover:bg-emerald-900/50 transition-colors"><LogOut className="w-4 h-4"/> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white capitalize">{activeTab} Management</h2>
            <button onClick={() => setShowClearModal(true)} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4" /> Clear All Data
            </button>
          </div>

          <div className="bg-[#0A1A14] border border-emerald-900/30 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-emerald-900/20 text-emerald-300">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  {activeTab === 'pending' && <th className="p-4">Assign Code & Approve</th>}
                  {activeTab !== 'pending' && <th className="p-4">Secret Code</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/20">
                {/* Pending Users View */}
                {activeTab === 'pending' && pendingUsers.map(u => (
                  <tr key={u.id} className="hover:bg-emerald-900/10 transition-colors">
                    <td className="p-4 text-white font-medium">{u.fullName}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">{u.role}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="Enter secret code..." className="bg-[#06120E] border border-emerald-900/50 rounded-lg px-3 py-2 text-white w-40 focus:outline-none focus:border-emerald-500" onKeyDown={(e) => { if (e.key === 'Enter') handleApprove(u.email, (e.target as HTMLInputElement).value); }} />
                        <button onClick={() => handleApprove(u.email, (document.querySelector(`input[placeholder="Enter secret code..."]`) as HTMLInputElement)?.value)} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors">Approve</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Teachers / Students View */}
                {activeTab === 'teachers' && teachers.map(u => (
                   <tr key={u.id} className="hover:bg-emerald-900/10 transition-colors">
                    <td className="p-4 text-white font-medium">{u.fullName}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400">{u.role}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input type="text" defaultValue={u.allowedAccessCode || ''} className="bg-[#06120E] border border-emerald-900/50 rounded-lg px-3 py-2 text-white w-40 focus:outline-none" onBlur={(e) => { if (e.target.value !== u.allowedAccessCode) api.post('/admin/set-access-code', { email: u.email, code: e.target.value }).then(() => showNotification('ok', 'Code updated')); }} />
                        <Key className="w-4 h-4 text-emerald-500" />
                      </div>
                    </td>
                  </tr>
                ))}
                {activeTab === 'students' && students.map(u => (
                   <tr key={u.id} className="hover:bg-emerald-900/10 transition-colors">
                    <td className="p-4 text-white font-medium">{u.fullName}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">{u.role} (Class {u.classLevel})</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input type="text" defaultValue={u.allowedAccessCode || ''} className="bg-[#06120E] border border-emerald-900/50 rounded-lg px-3 py-2 text-white w-40 focus:outline-none" onBlur={(e) => { if (e.target.value !== u.allowedAccessCode) api.post('/admin/set-access-code', { email: u.email, code: e.target.value }).then(() => showNotification('ok', 'Code updated')); }} />
                        <Key className="w-4 h-4 text-emerald-500" />
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'pending' && pendingUsers.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No pending approvals.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
