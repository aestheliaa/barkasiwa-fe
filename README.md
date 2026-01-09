# Frontend Barkasiwa 🎓

Marketplace kampus untuk jual beli barang bekas antar mahasiswa. Dibangun dengan Next.js 16, React 19, dan Tailwind CSS 4.

## ✨ Fitur Lengkap

### 🌐 Public Pages
- **Landing Page** - Hero section dengan featured products
- **Product List** - Katalog produk dengan filter kategori
- **Product Detail** - Detail produk dengan info penjual
- **Login & Register** - Autentikasi user

### 👤 User Features (Protected)
- **My Products** - Kelola produk sendiri (view, edit, delete)
- **Upload Product** - Form upload produk dengan foto
- **Edit Product** - Update informasi produk
- **Wishlist** - Simpan produk favorit

### 👨‍💼 Admin Features (Admin Only)
- **Admin Dashboard** - Statistics overview (users, products, categories, wishlists)
- **Manage Users** - Lihat semua user dan role
- **Manage Products** - Lihat & hapus semua produk
- **Manage Categories** - Lihat & tambah kategori baru

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ atau Bun
- Backend Barkasiwa running di `http://localhost:4000`

### Installation

```bash
# Install dependencies
bun install
# atau
npm install

# Run development server
bun dev
# atau
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
frontend-barkasiwa/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout dengan AuthProvider
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── products/                 # Public product pages
│   │   ├── page.tsx              # Product list
│   │   └── [id]/page.tsx         # Product detail
│   ├── dashboard/                # Protected user pages
│   │   ├── products/
│   │   │   ├── page.tsx          # My products
│   │   │   ├── new/page.tsx      # Upload product
│   │   │   └── [id]/edit/page.tsx # Edit product
│   │   └── wishlist/page.tsx     # My wishlist
│   └── admin/                    # Admin pages
│       ├── page.tsx              # Dashboard
│       ├── users/page.tsx        # Manage users
│       ├── products/page.tsx     # Manage products
│       └── categories/page.tsx   # Manage categories
├── components/                   # React components
│   ├── Navbar.tsx                # Navigation bar
│   └── ProductCard.tsx           # Product card component
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── lib/                          # Utilities
│   ├── api.ts                    # API client
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript types
│   └── api.ts                    # API types
└── .env.local                    # Environment variables
```

## 🔐 Authentication

Authentication menggunakan JWT token (localStorage) dan HttpOnly cookie.

### Usage

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin, loading, login, logout } = useAuth();

  // Check if user is logged in
  if (user) {
    console.log('Logged in as:', user.nama);
  }

  // Check if user is admin
  if (isAdmin) {
    console.log('User has admin privileges');
  }

  // Login
  await login(email, password);

  // Logout
  await logout();
}
```

## 📡 API Integration

API client tersedia di `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Get all products
const products = await api.getProducts();

// Get product detail
const product = await api.getProduct(id);

// Create product
const formData = new FormData();
formData.append('nama_barang', 'Laptop');
formData.append('harga', '5000000');
formData.append('category_id', '1');
formData.append('foto', file);
await api.createProduct(formData);

// Add to wishlist
await api.addToWishlist(productId);

// Admin: Get stats
const stats = await api.getAdminStats();
```

## 🎨 Styling

Menggunakan Tailwind CSS 4 dengan utility-first approach:

```tsx
<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
  <h1 className="text-3xl font-bold text-blue-600">Title</h1>
  <p className="text-gray-600 mt-2">Description</p>
</div>
```

## 🔧 Utility Functions

### Format Currency
```typescript
import { formatCurrency } from '@/lib/utils';
formatCurrency(5000000); // "Rp 5.000.000"
```

### Format Date
```typescript
import { formatDate } from '@/lib/utils';
formatDate('2025-01-09'); // "9 Januari 2025"
```

### Get Image URL
```typescript
import { getImageUrl } from '@/lib/utils';
getImageUrl('abc123.jpg'); // "http://localhost:4000/uploads/abc123.jpg"
```

## 🧪 Testing

### Test Credentials

**Admin:**
- Email: `admin@barkasiwa.com`
- Password: `admin123`

**User:**
- Register via `/register`

### Test Flow

1. **Landing Page** → http://localhost:3000
2. **Register** → Create new account
3. **Login** → Login with credentials
4. **Browse Products** → View product list
5. **Product Detail** → Click on product
6. **Add to Wishlist** → Click wishlist button
7. **Upload Product** → Go to "Produk Saya" → "+ Upload Produk"
8. **Admin Dashboard** → Login as admin → Click "Admin"

## 🌍 Environment Variables

File `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📦 Build & Deploy

### Development
```bash
bun dev
```

### Production Build
```bash
bun run build
bun start
```

### Type Check
```bash
bun run build
```

## 🐛 Troubleshooting

### CORS Error
Pastikan backend `.env` memiliki:
```env
CORS_ORIGIN=http://localhost:3000
```

### Image Not Loading
1. Pastikan backend running
2. Check file ada di `backend-barkasiwa/public/uploads/`
3. Verify `next.config.ts` sudah dikonfigurasi

### Authentication Error
Clear localStorage dan cookies:
```javascript
localStorage.clear();
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

## 📚 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **Package Manager:** Bun / npm
- **Image Optimization:** Next.js Image

## 🔗 Links

- **Backend API:** http://localhost:4000
- **Swagger Docs:** http://localhost:4000/
- **Backend Integration Guide:** [task/BACKEND_INTEGRATION.md](./task/BACKEND_INTEGRATION.md)
- **Frontend Starter Guide:** [task/FRONTEND_STARTER.md](./task/FRONTEND_STARTER.md)
- **Setup Guide:** [SETUP.md](./SETUP.md)

## 📝 Notes

- Backend harus running sebelum start frontend
- Protected routes akan redirect ke `/login` jika belum login
- Admin routes akan redirect ke `/` jika bukan admin
- Image upload max size sesuai backend config
- Token disimpan di localStorage dan HttpOnly cookie

## 🎯 Next Steps

- [ ] Add search functionality
- [ ] Add pagination
- [ ] Add product sorting
- [ ] Add user profile page
- [ ] Add chat/messaging feature
- [ ] Add notifications
- [ ] Add image gallery for products
- [ ] Add product reviews/ratings

## 📄 License

Private project for Barkasiwa marketplace.

---

**Happy Coding! 🚀**
