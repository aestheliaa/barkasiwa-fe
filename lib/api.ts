import { Category, Product, ProductDetail, ProductWithSeller, User, AdminStats, AdminProduct } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(data: {
    nama: string;
    asal_kampus: string;
    whatsapp?: string;
    email: string;
    password: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<{ token: string; message: string }> {
    const response = await this.request<{ token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', response.token);
    return response;
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/auth/me');
  }

  // Products
  async getProducts(search?: string, category?: number): Promise<ProductWithSeller[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    
    return this.request<ProductWithSeller[]>(endpoint);
  }

  async getProduct(id: number): Promise<ProductDetail> {
    return this.request<ProductDetail>(`/api/products/${id}`);
  }

  async getMyProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products/me/list');
  }

  async createProduct(formData: FormData): Promise<{ message: string; id: number; foto: string }> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProductWithImage(id: number, formData: FormData): Promise<{ message: string }> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/api/products/${id}/image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/categories');
  }

  // Wishlist
  async getMyWishlist(): Promise<ProductWithSeller[]> {
    return this.request<ProductWithSeller[]>('/api/wishlist/me');
  }

  async addToWishlist(productId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/wishlist/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(productId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/api/admin/stats');
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users');
  }

  async getAllProductsAdmin(): Promise<AdminProduct[]> {
    return this.request<AdminProduct[]>('/api/admin/products');
  }

  async deleteProductAdmin(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProfile(data: { nama?: string; asal_kampus?: string; whatsapp?: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePassword(data: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createCategory(data: { name: string; description?: string }): Promise<{ message: string; id: number }> {
    return this.request<{ message: string; id: number }>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Settings
  async getSettings(): Promise<Record<string, string>> {
    return this.request<Record<string, string>>('/api/settings');
  }

  async updateSettings(formData: FormData): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/settings', {
      method: 'PUT',
      body: formData,
    });
  }
}

export const api = new ApiClient();
