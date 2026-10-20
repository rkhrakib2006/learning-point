import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function ExamResults() {
  const { examId } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState<{ exam: any; results: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    api.get(`/exams/${examId}/results`).then(res => setData(res.data)).catch(() => nav('/teacher')).finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">Loading...</div>;
  if (!data) return <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">Not found</div>;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => nav('/teacher')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-5 h-5" /> Back to Dashboard</button>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{data.exam.title} - Results</h1>
          <p className="text-slate-400">Class {data.exam.classLevel} · Total Marks: {data.exam.totalMarks}</p>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-300"><tr><th className="p-4">Student</th><th className="p-4">Email</th><th className="p-4">Score</th><th className="p-4">Grade</th><th className="p-4">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-800/50">
              {data.results.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/20">
                  <td className="p-4 font-medium">{r.student.fullName}</td>
                  <td className="p-4 text-slate-400">{r.student.email}</td>
                  <td className="p-4 text-blue-400 font-bold">{r.totalScore ?? r.mcqScore ?? 0} / {data.exam.totalMarks}</td>
                  <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded text-sm">{r.grade || '—'}</span></td>
                  <td className="p-4 flex items-center gap-2">{r.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}{r.passed ? 'Passed' : 'Failed'}</td>
                </tr>
              ))}
              {data.results.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No submissions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}