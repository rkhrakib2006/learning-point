import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi } from '../api/examApi';
import { FileText, Save, PlusCircle, X, Clock, Star, Layers } from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';

export default function CreateExam() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'MCQ', classLevel: 8, mcqDurationMin: 30, cqDurationMin: 30, totalMarks: 20, passMarks: 8, startAt: new Date().toISOString().slice(0, 16), endAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16) });
  const [questions, setQuestions] = useState<any[]>([{ type: 'MCQ', text: '', marks: 5, options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }], correctKey: 'A' }]);

  const addQuestion = () => setQuestions([...questions, { type: 'MCQ', text: '', marks: 5, options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }], correctKey: 'A' }]);
  const removeQuestion = (index: number) => { if (questions.length === 1) return; setQuestions(questions.filter((_, i) => i !== index)); };
  const updateQ = (i: number, patch: any) => { const n = [...questions]; n[i] = { ...n[i], ...patch }; setQuestions(n); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await examApi.create({ ...form, startAt: new Date(form.startAt).toISOString(), endAt: new Date(form.endAt).toISOString(), questions }); nav('/teacher'); } 
    catch { alert('Failed to create exam'); }
    setLoading(false);
  };

  return (
    <TeacherLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="text-blue-500"/> Create New Exam</h1>
        <p className="text-slate-400 text-sm mt-1">Fill in the details below to create a new exam.</p>
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 lg:p-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Exam Title *</label><input className="w-full bg-[#0B0F19] border border-slate-700 p-3 rounded-xl text-white outline-none" placeholder="e.g. Math Midterm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Class *</label><select className="w-full bg-[#0B0F19] border border-slate-700 p-3 rounded-xl text-white outline-none" value={form.classLevel} onChange={e => setForm({ ...form, classLevel: +e.target.value })}>{[8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Exam Type *</label><select className="w-full bg-[#0B0F19] border border-slate-700 p-3 rounded-xl text-white outline-none" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="MCQ">MCQ Only</option><option value="CQ">CQ Only</option><option value="MIXED">Mixed (MCQ + CQ)</option></select></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Total Marks *</label><input type="number" className="w-full bg-[#0B0F19] border border-slate-700 p-3 rounded-xl text-white outline-none" placeholder="e.g. 100" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: +e.target.value })} required /></div>
          </div>
          <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> MCQ Time (Min)</label><input type="number" className="w-full bg-[#111827] border border-slate-700 p-2.5 rounded-lg text-white outline-none" value={form.mcqDurationMin} onChange={e => setForm({ ...form, mcqDurationMin: +e.target.value })} /></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> CQ Time (Min)</label><input type="number" className="w-full bg-[#111827] border border-slate-700 p-2.5 rounded-lg text-white outline-none" value={form.cqDurationMin} onChange={e => setForm({ ...form, cqDurationMin: +e.target.value })} /></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1"><Star className="w-3.5 h-3.5"/> Pass Marks</label><input type="number" className="w-full bg-[#111827] border border-slate-700 p-2.5 rounded-lg text-white outline-none" value={form.passMarks} onChange={e => setForm({ ...form, passMarks: +e.target.value })} /></div>
          </div>
          <div className="border-t border-slate-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Layers className="text-blue-500"/> Questions ({questions.length})</h2>
              <button type="button" onClick={addQuestion} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Add Question</button>
            </div>
            {questions.map((q, i) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-800 rounded-xl p-5 mb-4 relative">
                <button type="button" onClick={() => removeQuestion(i)} className="absolute top-4 right-4 text-slate-600 hover:text-red-400 p-1"><X className="w-5 h-5"/></button>
                <div className="flex gap-3 mb-3">
                  <select className="bg-[#111827] border border-slate-700 p-2 rounded-lg text-white text-sm" value={q.type} onChange={e => updateQ(i, { type: e.target.value })}><option value="MCQ">MCQ</option><option value="CQ">CQ</option></select>
                  <input type="number" className="w-24 bg-[#111827] border border-slate-700 p-2 rounded-lg text-white text-sm" placeholder="Marks" value={q.marks} onChange={e => updateQ(i, { marks: +e.target.value })} />
                </div>
                <textarea className="w-full bg-[#111827] border border-slate-700 p-3 rounded-lg text-white mb-3 outline-none" placeholder="Write your question here..." value={q.text} onChange={e => updateQ(i, { text: e.target.value })} required />
                {q.type === 'MCQ' && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {q.options.map((o: any, oi: number) => (
                      <input key={o.id} className="w-full bg-[#111827] border border-slate-700 p-2.5 rounded-lg text-white text-sm" placeholder={`Option ${o.id}`} value={o.text} onChange={e => { const opts = [...q.options]; opts[oi].text = e.target.value; updateQ(i, { options: opts }); }} required />
                    ))}
                    <select className="w-full bg-[#111827] border border-slate-700 p-2.5 rounded-lg text-white text-sm col-span-2" value={q.correctKey} onChange={e => updateQ(i, { correctKey: e.target.value })}><option value="A">Correct: Option A</option><option value="B">Correct: Option B</option><option value="C">Correct: Option C</option><option value="D">Correct: Option D</option></select>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"><Save className="w-5 h-5"/> {loading ? 'Creating...' : 'Save & Create Exam'}</button>
        </form>
      </div>
    </TeacherLayout>
  );
}