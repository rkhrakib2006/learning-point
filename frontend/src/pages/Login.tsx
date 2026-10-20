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
      setErr(e?.response?.data?.error ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F19]">
      
      {/* বাম দিকের হিরো সেকশন (বড় স্ক্রিনের জন্য) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#130f2b] to-[#0B0F19] flex-col justify-between p-16 overflow-hidden">
        
        {/* ব্যাকগ্রাউন্ড গ্লো */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-900/40 to-transparent rounded-t-[100%] transform translate-y-20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <Logo className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-1">Learning <span className="text-purple-400">Point</span></h1>
              <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">Learn . Practice . Grow</p>
            </div>
          </div>

          <div>
            <p className="text-purple-300 tracking-[0.3em] uppercase text-sm font-semibold mb-4">Welcome To</p>
            <h2 className="text-6xl font-bold text-white leading-tight mb-6">
              Learning <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Point</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-md">Your trusted platform for better learning and brighter future.</p>
          </div>

          <div className="flex gap-8 mt-16">
            <div className="flex flex-col items-center gap-2 text-slate-400"><GraduationCap className="w-6 h-6 text-purple-400" /><span className="text-xs">MCQ + CQ Exams</span></div>
            <div className="flex flex-col items-center gap-2 text-slate-400"><BarChart3 className="w-6 h-6 text-purple-400" /><span className="text-xs">Track Progress</span></div>
            <div className="flex flex-col items-center gap-2 text-slate-400"><ShieldCheck className="w-6 h-6 text-purple-400" /><span className="text-xs">Safe & Secure</span></div>
          </div>
        </div>

        <div className="relative z-10 text-slate-400 text-sm flex items-center gap-3">
          <div className="w-8 h-0.5 bg-purple-500 rounded-full" />
          Small Steps, Big Dreams
        </div>
      </div>

      {/* ডান দিকের ফর্ম সেকশন */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-200 relative">
        
        {/* উপরে Back to Home */}
        <Link to="/" className="absolute top-8 right-12 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium">
          Back to Home <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl">
          
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Logo className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Learning Point</h2>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-full mb-8">
            <button className="flex-1 bg-purple-600 text-white py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Login
            </button>
            <Link to="/register" className="flex-1 text-slate-500 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 hover:text-slate-800 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
               Sign Up
            </Link>
          </div>

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Forgot Password?</a>
            </div>

            {err && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{err}</div>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              {loading ? 'Logging in...' : <> Login <ArrowRight className="w-4 h-4" /> </>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account? <Link to="/register" className="text-purple-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
