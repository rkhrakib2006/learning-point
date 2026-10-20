import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { examApi } from '../api/examApi';
import { resultApi } from '../api/resultApi';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, CheckCircle2, LogOut } from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [tab, setTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    examApi.list().then(setExams).catch(() => {});
    resultApi.mine().then(setResults).catch(() => {});
  }, []);

  const completedExams = results.filter(r => r.status !== 'IN_PROGRESS');
  const availableExams = exams.filter(e => !completedExams.find(c => c.examId === e.id));

  const handleLogout = async () => { await logout(); nav('/login'); };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">{user?.fullName}</span>
          <button onClick={handleLogout} className="text-red-400 flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab('available')} className={`flex-1 py-3 rounded-xl font-bold ${tab === 'available' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Available Exams ({availableExams.length})</button>
          <button onClick={() => setTab('completed')} className={`flex-1 py-3 rounded-xl font-bold ${tab === 'completed' ? 'bg-green-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Completed Exams ({completedExams.length})</button>
        </div>
        {tab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableExams.length === 0 && <p className="text-slate-500">No available exams.</p>}
            {availableExams.map(e => (
              <div key={e.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">{e.title}</h3>
                <p className="text-sm text-slate-400 mb-4">Class {e.classLevel} · {e.durationMin} min</p>
                <button onClick={() => nav(`/exam/${e.id}`)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">Start Exam</button>
              </div>
            ))}
          </div>
        )}
        {tab === 'completed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedExams.length === 0 && <p className="text-slate-500">No completed exams.</p>}
            {completedExams.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
                <CheckCircle2 className="absolute top-4 right-4 text-green-500" />
                <h3 className="text-lg font-bold text-white mb-2">{r.exam?.title}</h3>
                <p className="text-sm text-slate-400 mb-4">Marks: {r.totalScore ?? r.mcqScore ?? 0} / {r.exam?.totalMarks}</p>
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400">Grade</span>
                  <span className="text-xl font-bold text-blue-400">{r.grade || 'Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}