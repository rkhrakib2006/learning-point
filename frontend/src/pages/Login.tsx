import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
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
      setErr(e?.response?.data?.error ?? 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#020D08] overflow-hidden p-4">
      
      {/* Background Liquid Glow Effects (Green/Teal) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-600/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-500/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Center Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#04140E]/60 backdrop-blur-2xl border border-emerald-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-slide-up">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-black/50 p-1 border border-emerald-500/20">
            <Logo className="w-full h-full object-contain rounded-2xl" />
          </div>
          <p className="text-sm text-emerald-100/60 font-medium">Enter master credentials</p>
        </div>

        <form onSubmit={handle} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-50 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/70" />
              <input 
                className="w-full pl-12 pr-4 py-3.5 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-700/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium" 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-50 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/70" />
              <input 
                className="w-full pl-12 pr-12 py-3.5 bg-[#082119]/80 border border-emerald-800/50 rounded-xl text-white placeholder-emerald-700/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium" 
                type={showPass ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/70 hover:text-emerald-300 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {err && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 text-red-400 text-sm font-medium border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {err}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-full"></span>
            {loading ? 'Authenticating...' : <> <ArrowRight className="w-5 h-5" /> Sign In </>}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-emerald-500/50">
          <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encrypted
        </div>

        <p className="text-center text-sm text-emerald-100/50 mt-4">
          Don't have an account? <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
