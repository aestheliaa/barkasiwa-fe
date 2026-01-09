'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { formatCurrency, getImageUrl, formatDate } from '@/lib/utils';
import { ProductDetail } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    loadProduct();
    if (user) {
      checkWishlist();
    }
  }, [params.id, user]);

  const loadProduct = async () => {
    try {
      const data = await api.getProduct(Number(params.id));
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const wishlist = await api.getMyWishlist();
      setInWishlist(wishlist.some((item) => item.id === Number(params.id)));
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (inWishlist) {
        await api.removeFromWishlist(Number(params.id));
        setInWishlist(false);
      } else {
        await api.addToWishlist(Number(params.id));
        setInWishlist(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah wishlist';
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center dark:text-white">
          Produk tidak ditemukan
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.foto);
  const isOwner = user?.id === product.user_id;

  // Format message untuk WhatsApp dan Email
  const whatsappMessage = encodeURIComponent(
    `Halo, saya tertarik dengan produk:\n\n` +
    `*${product.nama_barang}*\n` +
    `Harga: ${formatCurrency(product.harga)}\n` +
    `Kategori: ${product.category_name}\n\n` +
    `Apakah produk ini masih tersedia?`
  );

  const emailSubject = encodeURIComponent(`Pertanyaan tentang ${product.nama_barang}`);
  const emailBody = encodeURIComponent(
    `Halo ${product.seller_nama},\n\n` +
    `Saya tertarik dengan produk yang Anda jual:\n\n` +
    `Nama Produk: ${product.nama_barang}\n` +
    `Harga: ${formatCurrency(product.harga)}\n` +
    `Kategori: ${product.category_name}\n\n` +
    `Apakah produk ini masih tersedia? Mohon informasi lebih lanjut.\n\n` +
    `Terima kasih.`
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-4 md:py-8 pb-24 md:pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
            {/* Image */}
            <div className="relative h-64 md:h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={product.nama_barang}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Details */}
            <div>
              <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 dark:text-white">{product.nama_barang}</h2>
              
              <p className="text-2xl md:text-4xl font-bold text-[#ff8c42] mb-4 md:mb-6">
                {formatCurrency(product.harga)}
              </p>

              <div className="mb-4 md:mb-6">
                <h3 className="font-semibold text-base md:text-lg mb-2 dark:text-white">Deskripsi</h3>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {product.deskripsi || 'Tidak ada deskripsi'}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 md:pt-6 mb-4 md:mb-6">
                <h3 className="font-semibold text-base md:text-lg mb-2 md:mb-3 dark:text-white">Informasi Penjual</h3>
                <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1 md:space-y-2">
                  <p>
                    <span className="font-medium">Nama:</span> {product.seller_nama}
                  </p>
                  <p>
                    <span className="font-medium">Kampus:</span> {product.asal_kampus}
                  </p>
                  <p>
                    <span className="font-medium">Kategori:</span> {product.category_name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-3">
                    Diposting pada {formatDate(product.created_at)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                {!isOwner && (
                  <>
                    <button
                      onClick={handleWishlist}
                      className={`w-full md:flex-1 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition ${
                        inWishlist
                          ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {inWishlist ? '❤️ Hapus dari Wishlist' : '🤍 Tambah ke Wishlist'}
                    </button>
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="w-full md:flex-1 py-2.5 md:py-3 bg-[#ff8c42] text-white rounded-lg font-semibold text-sm md:text-base hover:bg-[#e67a35]"
                    >
                      Hubungi Penjual
                    </button>
                  </>
                )}
                {isOwner && (
                  <button
                    onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                    className="w-full md:flex-1 py-2.5 md:py-3 bg-[#1e4fa1] text-white rounded-lg font-semibold text-sm md:text-base hover:bg-[#163a7a]"
                  >
                    Edit Produk
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold dark:text-white">Hubungi Penjual</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Nama Penjual</p>
                <p className="text-sm md:text-base font-semibold dark:text-white">{product.seller_nama}</p>
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Kampus</p>
                <p className="text-sm md:text-base font-semibold dark:text-white">{product.asal_kampus}</p>
              </div>

              {product.seller_whatsapp && (
                <div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">WhatsApp</p>
                  <a
                    href={`https://wa.me/${product.seller_whatsapp.replace(/^0/, '62')}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-green-600 transition"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Chat via WhatsApp
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">Email</p>
                <a
                  href={`mailto:${product.seller_email}?subject=${emailSubject}&body=${emailBody}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Kirim Email
                </a>
              </div>

              {!product.seller_whatsapp && (
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 italic">
                  Penjual belum menambahkan nomor WhatsApp
                </p>
              )}
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-4 md:mt-6 py-2.5 md:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
