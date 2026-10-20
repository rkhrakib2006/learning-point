import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { Shield, Trash2, Key, Users, LogOut, CheckCircle2, AlertCircle, X, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'teacher' | 'student'>('dashboard');
  const [selectedClass, setSelectedClass] = useState<number>(8);

  const loadData = () => {
    api.get('/admin/users').then(res => setUsers(res.data.users)).catch(() => {});
    api.get('/admin/exams').then(res => setExams(res.data.exams)).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const showNotification = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSetCode = async (email: string, code: string) => {
    if (!code || code.trim() === '') return;
    try {
      await api.post('/admin/set-access-code', { email, code });
      showNotification('ok', `Code "${code}" set for ${email}`);
      loadData();
    } catch { showNotification('err', 'Failed to set code'); }
  };

  const confirmClearData = async () => {
    setLoading(true);
    try {
      await api.post('/admin/clear-data');
      showNotification('ok', 'All exam data cleared successfully!');
      setShowClearModal(false);
      loadData();
    } catch { showNotification('err', 'Failed to clear data'); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await logout(); nav('/login'); };
  const filteredUsers = users.filter(u => u.classLevel === selectedClass || u.role === 'TEACHER');
  const filteredExams = exams.filter(e => e.classLevel === selectedClass);

  return (
    <div className="min-h-screen bg-slate-950 flex relative">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down border ${toast.type === 'ok' ? 'bg-slate-900 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-red-500/50 text-red-400'}`}>
          {toast.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center relative">
            <button onClick={() => setShowClearModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-slate-400 mb-6">This will delete ALL exams, questions, and student results. User accounts will remain.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowClearModal(false)} className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors">Cancel</button>
              <button onClick={confirmClearData} disabled={loading} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors">{loading ? 'Clearing...' : 'Yes, Clear All Data'}</button>
            </div>
          </div>
        </div>
      )}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex z-20">
        <div className="p-6 border-b border-slate-800"><h1 className="text-xl font-bold text-red-400 flex items-center gap-2"><Shield /> Admin Panel</h1></div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}><Shield className="w-5 h-5"/> Dashboard</button>
          <button onClick={() => setActiveView('teacher')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'teacher' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}><BookOpen className="w-5 h-5"/> Teacher Panel</button>
          <button onClick={() => setActiveView('student')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'student' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}><Users className="w-5 h-5"/> Student Panel</button>
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 rounded-xl text-red-400 hover:bg-slate-700 transition-colors"><LogOut className="w-4 h-4"/> Logout</button></div>
      </aside>
      <main className="flex-1 p-8 relative overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white capitalize">{activeView} Panel</h2>
            <button onClick={() => setShowClearModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"><Trash2 className="w-4 h-4" /> Clear All Exam Data</button>
          </div>
          <div className="flex gap-2 mb-6 bg-slate-900 p-1.5 rounded-xl w-fit border border-slate-800">
            {[6, 7, 8, 9, 10, 11, 12].map(c => (
              <button key={c} onClick={() => setSelectedClass(c)} className={`px-5 py-2 rounded-lg font-bold transition-all ${selectedClass === c ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Class {c}</button>
            ))}
          </div>
          {activeView === 'dashboard' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-300"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Secret Code</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-white font-medium">{u.fullName}</td>
                      <td className="p-4 text-slate-400">{u.email}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'TEACHER' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>{u.role} {u.role === 'STUDENT' && `(Class ${u.classLevel})`}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input type="text" defaultValue={u.allowedAccessCode || ''} placeholder="Set code..." className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white w-40 focus:outline-none focus:border-blue-500" onBlur={(e) => { if (e.target.value !== u.allowedAccessCode) handleSetCode(u.email, e.target.value); }} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
                          <Key className="w-4 h-4 text-slate-500" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div className="text-center py-12 text-slate-500">No users found.</div>}
            </div>
          )}
          {activeView === 'teacher' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
               <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-300"><tr><th className="p-4">Exam Title</th><th className="p-4">Teacher Name</th><th className="p-4">Status</th><th className="p-4">Marks</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredExams.map(e => (
                    <tr key={e.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-white font-medium">{e.title}</td>
                      <td className="p-4 text-slate-400">{e.teacher.fullName}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${e.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{e.published ? 'Published' : 'Draft'}</span></td>
                      <td className="p-4 text-slate-400">{e.totalMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredExams.length === 0 && <div className="text-center py-12 text-slate-500">No exams found for Class {selectedClass}.</div>}
            </div>
          )}
          {activeView === 'student' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
               <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-300"><tr><th className="p-4">Student Name</th><th className="p-4">Email</th><th className="p-4">Exams Taken</th><th className="p-4">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                   {filteredUsers.filter(u => u.role === 'STUDENT').map(student => (
                    <tr key={student.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-white font-medium">{student.fullName}</td>
                      <td className="p-4 text-slate-400">{student.email}</td>
                      <td className="p-4 text-slate-400">0</td>
                      <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.filter(u => u.role === 'STUDENT').length === 0 && <div className="text-center py-12 text-slate-500">No students found for Class {selectedClass}.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}