import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, GraduationCap, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* বাম দিকের হিরো সেকশন */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0B0F19] flex-col justify-between p-16 overflow-hidden">
        {/* গ্লোয়িং অ্যানিমেশন */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-900/50 to-transparent rounded-t-[100%] transform translate-y-20" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <Logo className="w-12 h-12 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-1">Learning <span className="text-purple-400">Point</span></h1>
              <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-0.5">Learn . Practice . Grow</p>
            </div>
          </div>

          <div>
            <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-bold mb-4">Welcome To</p>
            <h2 className="text-6xl font-bold text-white leading-tight mb-6">
              Learning <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Point</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-md">Your trusted platform for better learning and brighter future.</p>
          </div>

          <div className="flex gap-8 mt-16">
            <div className="flex flex-col items-center gap-2 text-slate-400"><GraduationCap className="w-6 h-6 text-purple-500" /><span className="text-xs font-medium">MCQ + CQ Exams</span></div>
            <div className="flex flex-col items-center gap-2 text-slate-400"><BarChart3 className="w-6 h-6 text-purple-500" /><span className="text-xs font-medium">Track Progress</span></div>
            <div className="flex flex-col items-center gap-2 text-slate-400"><ShieldCheck className="w-6 h-6 text-purple-500" /><span className="text-xs font-medium">Safe & Secure</span></div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm flex items-center gap-3 font-medium">
          <div className="w-8 h-0.5 bg-purple-500 rounded-full" />
          Small Steps, Big Dreams
        </div>
      </div>

      {/* ডান দিকের ফর্ম সেকশন */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative">
        
        <Link to="/" className="absolute top-8 right-12 text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-colors">
          Back to Home <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
          
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Logo className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Learning Point</h2>
          </div>

          {/* টগল বাটন */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button className="flex-1 bg-white text-purple-600 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
              Login
            </button>
            <Link to="/register" className="flex-1 text-slate-500 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:text-slate-800 transition-colors">
               Sign Up
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back 👋</h2>
            <p className="text-sm text-slate-500 mt-2">Please sign in to your account</p>
          </div>

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot Password?</a>
            </div>

            {err && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">{err}</div>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              {loading ? 'Logging in...' : <> Sign In <ArrowRight className="w-5 h-5" /> </>}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button type="button" className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Don't have an account? <Link to="/register" className="text-purple-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
