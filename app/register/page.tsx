'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nama: '',
    asal_kampus: '',
    whatsapp: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Creating account...');

    try {
      await api.register(formData);
      toast.success('Registrasi berhasil! Silakan login.', { id: loadingToast });
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registrasi gagal';
      toast.error(message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-gray dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-primary hover:opacity-90 transition">
            Barkasiwa
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">Create a new account</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
            Marketplace barang bekas khusus mahasiswa
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Asal Kampus</label>
              <input
                type="text"
                name="asal_kampus"
                value={formData.asal_kampus}
                onChange={handleChange}
                placeholder="Contoh: Universitas Amikom Purwokerto"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                WhatsApp (Opsional)
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="08123456789"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Untuk memudahkan pembeli menghubungi Anda
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email mahasiswa"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition bg-white dark:bg-gray-700 dark:text-white"
                required
                minLength={6}
              />
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">
              Dengan mendaftar, Anda menyetujui syarat dan ketentuan Barkasiwa.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-success text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition shadow-lg"
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
