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
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#050314] overflow-hidden py-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[150px]" />
      </div>

      <div className="absolute top-8 right-12 hidden md:flex items-center gap-4 text-sm font-medium text-slate-300">
        <span>Learn</span> <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        <span>Practice</span> <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        <span>Grow</span>
      </div>

      <div className="relative z-10 flex flex-col items-center mb-8">
        <Logo className="w-20 h-20 mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
        <h1 className="text-3xl font-bold text-white tracking-wide">Learning <span className="text-purple-400">Point</span></h1>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#0A061D]/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] animate-slide-up">
        
        <div className="flex bg-[#1A103C] p-1.5 rounded-2xl mb-6">
          <Link to="/login" className="flex-1 text-slate-400 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:text-white transition-colors">
            <User className="w-4 h-4" /> Login
          </Link>
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <PlusCircle className="w-4 h-4" /> Sign Up
          </button>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input className="w-full pl-12 pr-4 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input className="w-full pl-12 pr-4 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input className="w-full pl-12 pr-12 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400">
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="w-full px-4 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white focus:outline-none" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
            {form.role === 'STUDENT' && (
              <select className="w-full px-4 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white focus:outline-none" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}>
                {[8, 9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            )}
          </div>

          {err && <div className="p-3 rounded-xl bg-red-900/30 text-red-400 text-sm font-medium border border-red-500/30">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all mt-2">
            {loading ? 'Creating...' : <> <ArrowRight className="w-5 h-5" /> Sign Up </>}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-purple-900/50"></div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-purple-900/50"></div>
        </div>

        <button type="button" className="w-full bg-[#140B2D] border border-purple-900/50 text-slate-300 py-3 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-[#1A103C] transition-colors">
          <img src="https://www.svgrepo.com/show/445125/google-color.svg" alt="Google" className="w-5 h-5" /> Connect with Google
        </button>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account? <Link to="/login" className="text-purple-400 font-semibold hover:underline">Login</Link>
        </p>
      </div>

      <p className="relative z-10 mt-12 text-xs text-slate-500">
        Learning Point © 2025 | All rights reserved
      </p>
    </div>
  );
}
