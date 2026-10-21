import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, PlusCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'STUDENT' as 'STUDENT' | 'TEACHER', classLevel: 8 });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register({ ...form, classLevel: form.role === 'STUDENT' ? form.classLevel : undefined });
      alert('Registration successful! Please wait for Admin approval.');
      nav('/login');
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#050314] p-4 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/20 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center mb-6">
        <Logo className="w-16 h-16 mb-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        <h1 className="text-2xl font-bold text-white">Learning <span className="text-purple-400">Point</span></h1>
      </div>

      <div className="relative z-10 w-full max-w-[380px] bg-[#0A061D]/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        <div className="flex bg-[#140B2D] p-1 rounded-xl mb-6">
          <Link to="/login" className="flex-1 text-slate-400 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:text-white transition-colors">
            <User className="w-4 h-4" /> Login
          </Link>
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" /> Sign Up
          </button>
        </div>

        <form onSubmit={handle} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="w-full pl-10 pr-3 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="w-full pl-10 pr-3 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="w-full pl-10 pr-10 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select className="w-full px-3 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white focus:outline-none" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
            {form.role === 'STUDENT' && (
              <select className="w-full px-3 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white focus:outline-none" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}>
                {[8, 9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            )}
          </div>

          {err && <div className="p-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-medium border border-red-500/20">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all mt-2 text-sm">
            {loading ? 'Creating...' : <> Sign Up <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Already have an account? <Link to="/login" className="text-purple-400 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
