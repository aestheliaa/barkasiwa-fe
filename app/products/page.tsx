'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { ProductWithSeller, Category } from '@/types/api';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get search and category from URL
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category');
    
    setSearchQuery(urlSearch);
    if (urlCategory) {
      setSelectedCategory(Number(urlCategory));
    }
    
    loadData(urlSearch, urlCategory ? Number(urlCategory) : undefined);
  }, [searchParams]);

  const loadData = async (search?: string, category?: number) => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(search, category),
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

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (categoryId) params.append('category', categoryId.toString());
    
    const queryString = params.toString();
    window.history.pushState({}, '', queryString ? `?${queryString}` : '/products');
    
    loadData(searchQuery || undefined, categoryId || undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory.toString());
    
    const queryString = params.toString();
    window.history.pushState({}, '', queryString ? `?${queryString}` : '/products');
    
    loadData(searchQuery || undefined, selectedCategory || undefined);
  };

  return (
    <div className="min-h-screen bg-bg-gray dark:bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Semua Produk'}
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="bg-accent text-white px-6 py-2 rounded-lg hover:opacity-90 font-semibold transition-all"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 md:px-5 py-2 rounded-lg font-medium transition text-sm md:text-base ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 md:px-5 py-2 rounded-lg font-medium transition text-sm md:text-base ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Tidak ada produk ditemukan
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
