'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { ProductWithSeller } from '@/types/api';

export function ProductCard({
  id,
  nama_barang,
  harga,
  foto,
  nama,
  asal_kampus,
  menit_lalu,
}: ProductWithSeller) {
  const imageUrl = getImageUrl(foto);

  return (
    <Link href={`/products/${id}`} className="block group">
      <div 
        style={{ backgroundColor: '#8bb7f0' }}
        className="rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl cursor-pointer"
      >
        <div className="relative h-48 md:h-60 bg-black overflow-hidden">
          <Image
            src={imageUrl}
            alt={nama_barang}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            unoptimized
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm md:text-base mb-2 truncate">
            {nama_barang}
          </h3>
          <p className="text-white font-bold text-lg md:text-xl mb-3">
            {formatCurrency(harga)}
          </p>
          <div className="flex justify-between items-center text-xs text-white/90">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="truncate max-w-[100px]" title={`${nama} - ${asal_kampus}`}>{nama}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{menit_lalu}m</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
