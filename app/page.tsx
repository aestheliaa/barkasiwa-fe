'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { ProductWithSeller, Category } from '@/types/api';

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-bg-gray dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* Search Bar */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-5">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 md:gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an item"
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <select className="flex-1 md:flex-none px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-gray-50 dark:bg-gray-700 dark:text-white">
                <option value="indonesia">Indonesia</option>
              </select>
              <button
                type="submit"
                className="bg-accent text-white px-6 md:px-8 py-3 rounded-lg hover:opacity-90 font-semibold shadow-md transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1">
        {/* Banner */}
        <section className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div 
            style={{ 
              background: 'linear-gradient(to right, #1e4fa1, #3b6fd8)' 
            }}
            className="text-white rounded-2xl p-6 md:p-10 shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Baru untuk Anda</h2>
            <p className="text-base md:text-lg opacity-90">{products.length} produk baru saja ditambahkan</p>
          </div>
        </section>

        {/* Explore Categories */}
        <section className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 dark:text-white">Explore</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg text-center cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-primary transition-all text-sm md:text-base font-medium dark:text-white"
              >
                {category.name}
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Products */}
        <section className="container mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 dark:text-white">Recommended For You</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12 italic">
              Produk akan muncul setelah pengguna mengunggah barang.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
