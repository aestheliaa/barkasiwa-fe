'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { Product } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadProducts();
    }
  }, [user, authLoading, router]);

  const loadProducts = async () => {
    try {
      const data = await api.getMyProducts();
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
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus produk';
      alert(message);
    }
  };

  if (authLoading || !user) {
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
        <h2 className="text-3xl font-bold mb-6 dark:text-white">Barang Saya</h2>

        {loading ? (
          <div className="text-center py-12 dark:text-white">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Anda belum memiliki produk</p>
            <Link
              href="/dashboard/products/new"
              className="text-[#1e4fa1] hover:underline"
            >
              Upload produk pertama Anda
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Nama Barang
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={getImageUrl(product.foto)}
                          alt={product.nama_barang}
                          fill
                          className="object-cover rounded"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium dark:text-white">{product.nama_barang}</td>
                    <td className="px-6 py-4 text-[#ff8c42] font-bold">
                      {formatCurrency(product.harga)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-[#1e4fa1] dark:text-[#8bb7f0] hover:underline text-sm"
                        >
                          Lihat
                        </Link>
                        <span className="text-gray-400 dark:text-gray-500">|</span>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="text-[#1e4fa1] dark:text-[#8bb7f0] hover:underline text-sm"
                        >
                          Edit
                        </Link>
                        <span className="text-gray-400 dark:text-gray-500">|</span>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 dark:text-red-400 hover:underline text-sm"
                        >
                          Hapus
                        </button>
                      </div>
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
