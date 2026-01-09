'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AdminProduct } from '@/types/api';

export default function AdminProductsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    } else if (user && isAdmin) {
      loadProducts();
    }
  }, [user, isAdmin, authLoading, router]);

  const loadProducts = async () => {
    try {
      const data = await api.getAllProductsAdmin();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      await api.deleteProductAdmin(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus produk';
      alert(message);
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
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Manage Products</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard
                  id={product.id}
                  nama_barang={product.nama_barang}
                  harga={product.harga}
                  foto={product.foto}
                  nama={product.seller_nama}
                  asal_kampus={product.asal_kampus}
                  menit_lalu={0}
                  user_id={product.user_id}
                  category_id={product.category_id}
                  deskripsi={product.deskripsi}
                  created_at={product.created_at}
                />
                <button
                  onClick={() => handleDelete(product.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
