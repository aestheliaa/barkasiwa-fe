'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    } else if (user && isAdmin) {
      loadUsers();
    }
  }, [user, isAdmin, authLoading, router]);

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (userId === user?.id) {
      toast.error('Tidak bisa menghapus akun sendiri!');
      return;
    }

    if (userToDelete?.role === 'admin') {
      toast.error('Tidak bisa menghapus user dengan role admin!');
      return;
    }

    if (!confirm('Yakin ingin menghapus user ini?')) return;

    try {
      await api.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('User berhasil dihapus');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus user';
      toast.error(message);
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
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Manage Users</h1>

        {loading ? (
          <div className="text-center py-12 dark:text-white">Loading...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Kampus
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm dark:text-gray-300">
                      {u.id}
                    </td>
                    <td className="px-6 py-4 font-medium dark:text-white">
                      {u.nama}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {u.whatsapp || '-'}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {u.asal_kampus}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          u.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.id !== user?.id && u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-red-600 dark:text-red-400 hover:underline text-sm"
                        >
                          Hapus
                        </button>
                      )}
                      {u.role === 'admin' && u.id !== user?.id && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
