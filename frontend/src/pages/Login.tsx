import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, PlusCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = '/';
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#050314] p-4 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center mb-6">
        <Logo className="w-16 h-16 mb-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        <h1 className="text-2xl font-bold text-white">Learning <span className="text-purple-400">Point</span></h1>
        <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">Learn . Practice . Grow</p>
      </div>

      <div className="relative z-10 w-full max-w-[380px] bg-[#0A061D]/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        
        <div className="flex bg-[#140B2D] p-1 rounded-xl mb-6">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            <User className="w-4 h-4" /> Login
          </button>
          <Link to="/register" className="flex-1 text-slate-400 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:text-white transition-colors">
            <PlusCircle className="w-4 h-4" /> Sign Up
          </Link>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">Welcome Back 👋</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handle} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="w-full pl-10 pr-3 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="w-full pl-10 pr-10 py-2.5 bg-[#140B2D] border border-purple-900/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {err && <div className="p-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-medium border border-red-500/20">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all mt-2 text-sm">
            {loading ? 'Logging in...' : <> Login <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-purple-900/30"></div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-purple-900/30"></div>
        </div>

        <button type="button" className="w-full bg-[#140B2D] border border-purple-900/40 text-slate-300 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#1A103C] transition-colors text-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" /> Continue with Google
        </button>

        <p className="text-center text-xs text-slate-400 mt-5">
          Don't have an account? <Link to="/register" className="text-purple-400 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
