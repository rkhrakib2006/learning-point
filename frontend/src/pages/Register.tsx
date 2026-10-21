import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center bg-[#020D08] overflow-hidden p-4 py-10">
      
      {/* Background Liquid Glow Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-600/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-500/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 w-full max-w-[440px] bg-[#04140E]/60 backdrop-blur-2xl border border-emerald-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-slide-up">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-black/50 p-1 border border-emerald-500/20">
            <Logo className="w-full h-full object-contain rounded-2xl" />
          </div>
          <p className="text-sm text-emerald-100/60 font-medium">Create your Learning Point account</p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-emerald-50 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/70" />
              <input className="w-full pl-12 pr-4 py-3 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-700/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium" placeholder="Enter full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-50 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/70" />
              <input className="w-full pl-12 pr-4 py-3 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-700/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium" type="email" placeholder="Enter email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-50 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/70" />
              <input className="w-full pl-12 pr-12 py-3 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-700/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium" type={showPass ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/70 hover:text-emerald-300 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-50 mb-1.5">Role</label>
              <select className="w-full px-4 py-3 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-all font-medium" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            {form.role === 'STUDENT' && (
              <div>
                <label className="block text-sm font-semibold text-emerald-50 mb-1.5">Class</label>
                <select className="w-full px-4 py-3 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-all font-medium" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}>
                  {[8, 9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            )}
          </div>

          {err && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 text-red-400 text-sm font-medium border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {err}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] mt-2">
            <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-full"></span>
            {loading ? 'Creating...' : <> <ArrowRight className="w-5 h-5" /> Sign Up </>}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-500/50">
          <ShieldCheck className="w-4 h-4" /> Secure Registration
        </div>

        <p className="text-center text-sm text-emerald-100/50 mt-4">
          Already have an account? <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors">Login</Link>
        </p>
      </div>
    </div>
  );
}
