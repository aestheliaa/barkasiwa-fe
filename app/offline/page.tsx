'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-bg-gray dark:bg-gray-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Tidak Ada Koneksi
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sepertinya kamu sedang offline. Periksa koneksi internet kamu dan coba lagi.
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
        >
          Coba Lagi
        </button>

        {/* Back to Home */}
        <Link
          href="/"
          className="block text-primary hover:text-primary-dark font-medium transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
