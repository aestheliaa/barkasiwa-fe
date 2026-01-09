'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { Category } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminCategoriesPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    } else if (user && isAdmin) {
      loadCategories();
    }
  }, [user, isAdmin, authLoading, router]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.createCategory(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      await loadCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal membuat kategori';
      setError(message);
    } finally {
      setSubmitting(false);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Manage Categories</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark"
          >
            {showForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e4fa1]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e4fa1]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#1e4fa1] text-white rounded-lg font-semibold hover:bg-[#163a7a] disabled:bg-gray-400"
              >
                {submitting ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
