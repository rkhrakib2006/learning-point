import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-center">
      <div>
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <p className="text-slate-400 mb-6">Page not found</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}