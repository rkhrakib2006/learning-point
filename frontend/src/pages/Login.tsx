import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center bg-[#0B0F19] overflow-hidden p-4">
      
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-slide-up">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
            <Logo className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Please sign in to continue</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button className="flex-1 bg-white text-purple-600 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">Login</button>
          <Link to="/register" className="flex-1 text-slate-500 py-2 rounded-lg text-sm font-semibold flex items-center justify-center hover:text-slate-800 transition-colors">Sign Up</Link>
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input className="input pl-12" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input className="input pl-12 pr-12" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot Password?</a>
          </div>

          {err && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all mt-2">
            {loading ? 'Processing...' : <> Sign In <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <Link to="/register" className="text-purple-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
