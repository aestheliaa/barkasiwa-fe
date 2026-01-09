'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { AdminStats } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    } else if (user && isAdmin) {
      loadStats();
    }
  }, [user, isAdmin, authLoading, router]);

  const loadStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-gray dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-gray dark:bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-6 py-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Dashboard</h1>

        {loading ? (
          <div className="text-center py-12 dark:text-white">Loading...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-primary dark:text-blue-400">{stats?.users || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Total Users</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-3xl font-bold text-primary dark:text-blue-400">{stats?.products || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Total Products</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-3xl mb-2">🏷️</div>
                <div className="text-3xl font-bold text-primary dark:text-blue-400">{stats?.categories || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Categories</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-3xl mb-2">❤️</div>
                <div className="text-3xl font-bold text-primary dark:text-blue-400">{stats?.wishlists || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">Wishlist Items</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Management</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Link
                  href="/admin/users"
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-primary text-center transition"
                >
                  <div className="text-3xl mb-2">👥</div>
                  <div className="font-semibold dark:text-white">Manage Users</div>
                </Link>
                <Link
                  href="/admin/products"
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-primary text-center transition"
                >
                  <div className="text-3xl mb-2">📦</div>
                  <div className="font-semibold dark:text-white">Manage Products</div>
                </Link>
                <Link
                  href="/admin/categories"
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-primary text-center transition"
                >
                  <div className="text-3xl mb-2">🏷️</div>
                  <div className="font-semibold dark:text-white">Manage Categories</div>
                </Link>
                <Link
                  href="/admin/settings"
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-primary text-center transition"
                >
                  <div className="text-3xl mb-2">⚙️</div>
                  <div className="font-semibold dark:text-white">Website Settings</div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
