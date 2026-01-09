'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Logging in...');

    try {
      await login(email, password);
      toast.success('Login berhasil!', { id: loadingToast });
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      toast.error(message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-gray dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary hover:opacity-90 transition">
            Barkasiwa
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Log in to Barkasiwa</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address or mobile number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition shadow-lg"
            >
              {loading ? 'Loading...' : 'Log in'}
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgotten password?
            </a>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-success text-white rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
            >
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
