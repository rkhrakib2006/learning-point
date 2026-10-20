import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Save, PlusCircle, X, FileText } from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';

export default function EditExam() {
  const { examId } = useParams();
  const nav = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/exams/${examId}`).then(res => setExam(res.data.exam)).catch(() => nav('/teacher')).finally(() => setLoading(false));
  }, [examId, nav]);

  const handleChange = (field: string, value: any) => setExam((prev: any) => ({ ...prev, [field]: value }));
  const handleQChange = (index: number, field: string, value: any) => { const newQ = [...exam.questions]; newQ[index] = { ...newQ[index], [field]: value }; setExam({ ...exam, questions: newQ }); };
  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => { const newQ = [...exam.questions]; newQ[qIndex].options[oIndex].text = value; setExam({ ...exam, questions: newQ }); };
  const addQuestion = () => setExam({ ...exam, questions: [...exam.questions, { type: 'MCQ', text: '', marks: 5, options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }], correctKey: 'A' }] });
  const removeQuestion = (index: number) => { if (exam.questions.length === 1) return; setExam({ ...exam, questions: exam.questions.filter((_: any, i: number) => i !== index) }); };

  const saveChanges = async () => {
    setSaving(true);
    try { await api.put(`/exams/${exam.id}`, exam); nav('/teacher'); } 
    catch { alert('Failed to save'); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">Loading...</div>;
  if (!exam) return null;

  return (
    <TeacherLayout>
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><FileText className="text-blue-500"/> Edit Exam: {exam.title}</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Exam Title</label>
            <input className="w-full bg-[#0B0F19] border border-slate-700 p-3 rounded-xl text-white outline-none" value={exam.title} onChange={(e) => handleChange('title', e.target.value)} />
          </div>
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-400">Questions ({exam.questions?.length || 0})</h3>
              <button onClick={addQuestion} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-white"><PlusCircle className="w-4 h-4"/> Add Question</button>
            </div>
            {exam.questions?.map((q: any, i: number) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4 mb-3 relative">
                <button onClick={() => removeQuestion(i)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><X className="w-5 h-5"/></button>
                <div className="flex gap-3 mb-3">
                  <span className="bg-slate-800 text-white px-2 py-1 rounded text-sm">{q.type}</span>
                  <input type="number" className="bg-slate-800 text-white px-2 py-1 rounded text-sm w-20 outline-none" value={q.marks} onChange={(e) => handleQChange(i, 'marks', +e.target.value)} />
                </div>
                <textarea className="w-full bg-[#111827] border border-slate-700 p-3 rounded-lg text-white mb-2 outline-none" value={q.text} onChange={(e) => handleQChange(i, 'text', e.target.value)} />
                {q.type === 'MCQ' && q.options && (
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((o:any, oi:number) => (
                      <input key={o.id} className="bg-[#111827] border border-slate-700 p-2 rounded-lg text-sm text-white outline-none" value={o.text} onChange={(e) => handleOptionChange(i, oi, e.target.value)} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-6 border-t border-slate-800">
            <button onClick={saveChanges} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-white"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}