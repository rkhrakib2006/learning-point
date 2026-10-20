import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock, AlertCircle, Shield } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = email.toLowerCase() === 'examroom2008@gmail.com';

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      if (isAdmin && adminCode !== '998877') throw new Error('Invalid Admin Secret Code.');
      window.location.href = '/';
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? e.message ?? 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-950 flex items-center justify-center p-6">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="card glow-effect">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex justify-center">
               <Logo className="w-32 h-32 drop-shadow-2xl hover:scale-105 transition-transform" />
            </div>
            <p className="text-sm text-slate-400 mt-2">{isAdmin ? 'Admin Secure Login' : 'আপনার account-এ login করুন'}</p>
          </div>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input className="input pl-11" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input className="input pl-11" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Admin Secret Code</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input className="input pl-11" type="password" placeholder="Enter master code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                </div>
              </div>
            )}
            {err && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{err}</div>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5">
              {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-primary-900/40 text-center">
            <p className="text-sm text-slate-400">Account নেই? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">Register করুন</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}