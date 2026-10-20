import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi } from '../api/examApi';
import { api } from '../api/client';
import { FileText, CheckCircle2, PlayCircle, Edit, Eye, Star, Clock, Trash2, X } from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';

export default function TeacherDashboard() {
  const nav = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const loadExams = () => examApi.list().then(setExams).catch(() => {});
  useEffect(() => { loadExams(); }, []);

  const confirmDelete = async () => {
    try { await api.delete(`/exams/${deleteModal.id}`); setDeleteModal({ open: false, id: '' }); loadExams(); } 
    catch { alert('Failed'); }
  };

  const handlePublish = async (id: string) => {
    try { await api.patch(`/exams/${id}/publish`); loadExams(); } catch { alert('Failed'); }
  };

  const filteredExams = exams.filter(e => e.classLevel === selectedClass);
  const totalExams = exams.length;
  const publishedExams = exams.filter(e => e.published).length;

  return (
    <TeacherLayout>
      {deleteModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-sm w-full relative">
             <button onClick={() => setDeleteModal({ open: false, id: '' })} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
             <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500"/></div>
             <h3 className="text-xl font-bold text-white text-center mb-2">Delete Exam?</h3>
             <p className="text-center text-slate-400 mb-6">This will permanently delete the exam and all student results.</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteModal({ open: false, id: '' })} className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700">Cancel</button>
               <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Delete</button>
             </div>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Teacher <span className="text-blue-500">Dashboard</span></h1>
        <p className="text-slate-400">Manage your exams and track student progress</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><FileText className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Total Exams</p><p className="text-2xl font-bold text-white">{totalExams}</p></div>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Published</p><p className="text-2xl font-bold text-white">{publishedExams}</p></div>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400"><FileText className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Selected Class</p><p className="text-2xl font-bold text-white">Class {selectedClass}</p></div>
        </div>
      </div>
      <div className="flex gap-2 mb-6 bg-[#111827] p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        {[8, 9, 10, 11, 12].map(c => (
          <button key={c} onClick={() => setSelectedClass(c)} className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${selectedClass === c ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Class {c}</button>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500"/> Class {selectedClass} Exams</h2>
          <p className="text-sm text-slate-400">Manage and create exams for your assigned class.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((e) => (
          <div key={e.id} className="bg-[#111827] border border-slate-800 rounded-2xl flex flex-col group relative">
            <div className="h-32 bg-gradient-to-br from-blue-900/40 to-slate-900 relative rounded-t-2xl overflow-hidden p-4">
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${e.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{e.published ? 'Published' : 'Draft'}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2">{e.title}</h3>
              <div className="flex gap-2 mb-4">
                <span className="bg-slate-800 text-blue-300 text-xs px-2.5 py-1 rounded-md">{e.type}</span>
                <span className="bg-slate-800 text-blue-300 text-xs px-2.5 py-1 rounded-md">Class {e.classLevel}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> MCQ: {e.mcqDurationMin}m</div>
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> CQ: {e.cqDurationMin}m</div>
              </div>
              <div className="flex items-center gap-1 text-sm text-yellow-400 mb-5"><Star className="w-4 h-4 fill-yellow-400" /> Marks: {e.totalMarks}</div>
              <div className="mt-auto flex gap-2">
                {e.published ? (
                  <button onClick={() => nav(`/exam/${e.id}/results`)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"><Eye className="w-4 h-4" /> Results</button>
                ) : (
                  <button onClick={() => handlePublish(e.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"><PlayCircle className="w-4 h-4" /> Publish</button>
                )}
                <button onClick={() => nav(`/exam/${e.id}/edit`)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteModal({ open: true, id: e.id })} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredExams.length === 0 && <div className="col-span-full py-12 text-center text-slate-500 bg-[#111827] rounded-2xl border border-slate-800 border-dashed">No exams created for Class {selectedClass} yet.</div>}
      </div>
    </TeacherLayout>
  );
}