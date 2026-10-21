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
      setErr(e?.response?.data?.error ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#050314] overflow-hidden py-10">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-purple-900/40 to-transparent" />
      </div>

      {/* Top Header (Learn Practice Grow) */}
      <div className="absolute top-8 right-12 hidden md:flex items-center gap-4 text-sm font-medium text-slate-300">
        <span>Learn</span> <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        <span>Practice</span> <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        <span>Grow</span>
      </div>

      {/* Logo Section */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <Logo className="w-24 h-24 mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
        <h1 className="text-3xl font-bold text-white tracking-wide">Learning <span className="text-purple-400">Point</span></h1>
        <p className="text-xs text-slate-400 mt-2 tracking-widest uppercase">Learn . Practice . Grow</p>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0A061D]/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] animate-slide-up">
        
        {/* Toggle Buttons */}
        <div className="flex bg-[#1A103C] p-1.5 rounded-2xl mb-8">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <User className="w-4 h-4" /> Login
          </button>
          <Link to="/register" className="flex-1 text-slate-400 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:text-white transition-colors">
            <PlusCircle className="w-4 h-4" /> Sign Up
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">Welcome Back <span className="text-2xl">👋</span></h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to your Learning Point account</p>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input className="w-full pl-12 pr-4 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input className="w-full pl-12 pr-12 py-3.5 bg-[#140B2D] border border-purple-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {err && <div className="p-3 rounded-xl bg-red-900/30 text-red-400 text-sm font-medium border border-red-500/30">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all mt-4">
            {loading ? 'Logging in...' : <> <ArrowRight className="w-5 h-5" /> Login </>}
          </button>
        </form>

        {/* OR Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-purple-900/50"></div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-purple-900/50"></div>
        </div>

        <button type="button" className="w-full bg-[#140B2D] border border-purple-900/50 text-slate-300 py-3 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-[#1A103C] transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Connect with Google
        </button>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account? <Link to="/register" className="text-purple-400 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-12 text-xs text-slate-500">
        Learning Point © 2025 | All rights reserved
      </p>
    </div>
  );
}
