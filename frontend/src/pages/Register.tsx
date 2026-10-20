import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center bg-[#0B0F19] overflow-hidden p-4 py-10">
      
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[450px] bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-slide-up">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 mb-3 rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
            <Logo className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join Learning Point today</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <Link to="/login" className="flex-1 text-slate-500 py-2 rounded-lg text-sm font-semibold flex items-center justify-center hover:text-slate-800 transition-colors">Login</Link>
          <button className="flex-1 bg-white text-purple-600 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">Sign Up</button>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input className="input pl-12" placeholder="Enter your full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input className="input pl-12" type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input className="input pl-12 pr-12" type={showPass ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            {form.role === 'STUDENT' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Class</label>
                <select className="input" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}>
                  {[8, 9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            )}
          </div>

          {err && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all mt-2">
            {loading ? 'Creating...' : <> Sign Up <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account? <Link to="/login" className="text-purple-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
