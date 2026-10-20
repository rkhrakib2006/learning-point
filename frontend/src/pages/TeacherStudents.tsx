import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { UserCircle2, CheckCircle2, XCircle } from 'lucide-react';
import TeacherLayout from '../components/TeacherLayout';

export default function TeacherStudents() {
  const nav = useNavigate();
  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => { api.get(`/exams/students/${selectedClass}`).then(res => setStudents(res.data.students)).catch(() => {}); }, [selectedClass]);

  return (
    <TeacherLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><UserCircle2 className="text-blue-500"/> My Students</h1>
        <p className="text-slate-400 text-sm mt-1">View all students enrolled in your classes.</p>
      </div>
      <div className="flex gap-2 mb-6 bg-[#111827] p-1.5 rounded-xl border border-slate-800 w-fit overflow-x-auto">
        {[8, 9, 10, 11, 12].map(c => (
          <button key={c} onClick={() => setSelectedClass(c)} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${selectedClass === c ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Class {c}</button>
        ))}
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-300"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Joined</th></tr></thead>
          <tbody className="divide-y divide-slate-800/50">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="p-4 font-medium flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">{s.fullName.charAt(0)}</div>{s.fullName}</td>
                <td className="p-4 text-slate-400">{s.email}</td>
                <td className="p-4 flex items-center gap-2">{s.isActive ? <><CheckCircle2 className="w-4 h-4 text-emerald-500"/> <span className="text-emerald-400 text-sm">Active</span></> : <><XCircle className="w-4 h-4 text-red-500"/> <span className="text-red-400 text-sm">Inactive</span></>}</td>
                <td className="p-4 text-slate-500 text-sm">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No students in Class {selectedClass}</td></tr>}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
}