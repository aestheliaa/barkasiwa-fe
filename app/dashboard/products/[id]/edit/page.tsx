'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { Category } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProductPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    nama_barang: '',
    harga: '',
    category_id: '',
    deskripsi: '',
  });
  const [displayHarga, setDisplayHarga] = useState('');
  const [currentFoto, setCurrentFoto] = useState<string | null>(null);
  const [newFoto, setNewFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [product, categoriesData] = await Promise.all([
        api.getProduct(Number(params.id)),
        api.getCategories(),
      ]);

      if (product.user_id !== user?.id) {
        router.push('/dashboard/products');
        return;
      }

      setFormData({
        nama_barang: product.nama_barang,
        harga: product.harga.toString(),
        category_id: product.category_id.toString(),
        deskripsi: product.deskripsi || '',
      });
      
      // Set display harga
      const formatted = new Intl.NumberFormat('id-ID').format(product.harga);
      setDisplayHarga(`Rp ${formatted}`);
      
      // Set current foto
      setCurrentFoto(product.foto);
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      router.push('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter non-digit
    setFormData({
      ...formData,
      harga: value,
    });
    
    // Format untuk display
    if (value) {
      const formatted = new Intl.NumberFormat('id-ID').format(Number(value));
      setDisplayHarga(`Rp ${formatted}`);
    } else {
      setDisplayHarga('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // If there's a new photo, use FormData
      if (newFoto) {
        const data = new FormData();
        data.append('nama_barang', formData.nama_barang);
        data.append('harga', formData.harga);
        data.append('category_id', formData.category_id);
        if (formData.deskripsi) {
          data.append('deskripsi', formData.deskripsi);
        }
        data.append('foto', newFoto);

        await api.updateProductWithImage(Number(params.id), data);
      } else {
        // No new photo, just update text fields
        await api.updateProduct(Number(params.id), {
          nama_barang: formData.nama_barang,
          harga: Number(formData.harga),
          category_id: Number(formData.category_id),
          deskripsi: formData.deskripsi || null,
        });
      }
      router.push('/dashboard/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengupdate produk';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user || loading) {
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
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Edit Barang</h2>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Nama Barang</label>
                <input
                  type="text"
                  name="nama_barang"
                  value={formData.nama_barang}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Kategori</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Harga</label>
                <input
                  type="text"
                  name="harga"
                  value={displayHarga}
                  onChange={handleHargaChange}
                  placeholder="Rp 0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Masukkan harga dalam Rupiah
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Foto Barang</label>
                
                {/* Current Image */}
                {currentFoto && !preview && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Foto saat ini:</p>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${currentFoto}`}
                      alt="Current"
                      className="max-h-64 rounded-lg"
                    />
                  </div>
                )}

                {/* New Image Preview */}
                {preview && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Foto baru:</p>
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 rounded-lg"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Kosongkan jika tidak ingin mengubah foto
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark disabled:bg-gray-400"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
