import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'STUDENT' as 'STUDENT' | 'TEACHER', classLevel: 8, school: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register({ ...form, classLevel: form.role === 'STUDENT' ? form.classLevel : undefined });
      nav('/login');
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="card w-full max-w-md glow-effect">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>
        <form onSubmit={handle} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input pl-11" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input pl-11" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input pl-11" type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
          {form.role === 'STUDENT' && (
            <select className="input" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}>
              {[8, 9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}</option>)}
            </select>
          )}
          {err && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{err}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5">
             {loading ? 'Loading...' : <><UserPlus className="w-5 h-5" /> Register</>}
          </button>
        </form>
        <p className="text-center text-slate-400 text-sm mt-6">Have account? <Link to="/login" className="text-primary-400 font-semibold hover:underline">Login</Link></p>
      </div>
    </div>
  );
}