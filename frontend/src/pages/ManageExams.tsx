import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi } from '../api/examApi';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import TeacherLayout from '../components/TeacherLayout';

export default function ManageExams() {
  const nav = useNavigate();
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => { examApi.list().then(setExams).catch(() => {}); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try { await api.delete(`/exams/${id}`); window.location.reload(); } catch { alert('Failed'); }
  };

  return (
    <TeacherLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="text-blue-500"/> Manage All Exams</h1>
        <p className="text-slate-400 text-sm mt-1">View, edit, or delete all the exams you have created.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map(e => (
          <div key={e.id} className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-white">{e.title}</h3>
                 <span className={`text-xs px-2 py-1 rounded ${e.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{e.published ? 'Published' : 'Draft'}</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">Class {e.classLevel} · {e.totalMarks} Marks</p>
            </div>
            <div className="flex gap-2 border-t border-slate-800 pt-3">
              <button onClick={() => nav(`/exam/${e.id}/edit`)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-sm flex items-center justify-center gap-1 text-white"><Edit className="w-4 h-4"/> Edit</button>
              <button onClick={() => handleDelete(e.id)} className="px-3 py-2 bg-slate-800 hover:bg-red-900/50 rounded-lg text-slate-300 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
        {exams.length === 0 && <p className="text-slate-400 col-span-full">No exams found.</p>}
      </div>
    </TeacherLayout>
  );
}