import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try { await login(email, password); navigate('/'); }
    catch { setError('Invalid email or password'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign in to PDFCraft</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {error && <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" required />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" required />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            No account? <Link to="/register" className="text-indigo-600 font-medium">Sign up free</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
