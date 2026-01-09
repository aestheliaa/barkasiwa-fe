export interface User {
  id: number;
  nama: string;
  asal_kampus: string;
  email: string;
  whatsapp?: string;
  role: 'admin' | 'user';
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  user_id: number;
  category_id: number;
  nama_barang: string;
  harga: number;
  deskripsi: string | null;
  foto: string | null;
  created_at: string;
}

export interface ProductWithSeller extends Product {
  nama: string;
  asal_kampus: string;
  menit_lalu: number;
}

export interface ProductDetail extends Product {
  seller_nama: string;
  seller_email: string;
  seller_whatsapp?: string;
  asal_kampus: string;
  category_name: string;
}

export interface AdminProduct extends ProductDetail {
  seller_email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface ApiError {
  message: string;
}

export interface AdminStats {
  users: number;
  products: number;
  categories: number;
  wishlists: number;
}
