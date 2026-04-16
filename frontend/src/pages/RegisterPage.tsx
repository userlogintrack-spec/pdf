import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirm) { setError("Passwords don't match"); return; }
    setIsLoading(true);
    try { await register(email, username, password, passwordConfirm); navigate('/'); }
    catch { setError('Registration failed. Try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create your account</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {error && <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          {[
            { label: 'Email', type: 'email', value: email, set: setEmail },
            { label: 'Username', type: 'text', value: username, set: setUsername },
            { label: 'Password', type: 'password', value: password, set: setPassword },
            { label: 'Confirm password', type: 'password', value: passwordConfirm, set: setPasswordConfirm },
          ].map((f) => (
            <div key={f.label} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                required minLength={f.type === 'password' ? 8 : undefined} />
            </div>
          ))}
          <button type="submit" disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer mt-2">
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
