import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { ShieldCheck, Lock, LogOut } from 'lucide-react';
import Logo from '../components/Logo';

export default function AccessCode() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return setErr('Please enter a code');
    setErr('');
    setLoading(true);
    try {
      if (user?.role === 'TEACHER') {
        await api.post('/auth/verify-teacher', { email: user.email, code });
      } else {
        await api.post('/auth/verify-access', { code });
      }
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.isAccessUnlocked = true;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
      window.location.href = '/';
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-dark-950 flex items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="card glow-effect text-center">
          <div className="mx-auto mb-6 flex justify-center"><Logo className="w-24 h-24 drop-shadow-2xl" /></div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Locked</h2>
          <p className="text-slate-400 text-sm mb-8">আপনার Admin/Teacher যে Access Code দিয়েছেন সেটি দিন।</p>
          <form onSubmit={handleVerify} className="space-y-4">
            <input type="password" className="input text-center text-lg tracking-widest" placeholder="Enter Secret Code" value={code} onChange={(e) => setCode(e.target.value)} required />
            {err && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20">{err}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Verifying...' : <><Lock className="w-4 h-4" /> Unlock Dashboard</>}
            </button>
          </form>
          <button onClick={async () => { await logout(); nav('/login'); }} className="mt-6 text-sm text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}