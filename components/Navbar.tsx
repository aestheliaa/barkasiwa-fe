'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ThemeToggle } from './ThemeToggle';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout berhasil!');
      router.push('/');
    } catch {
      toast.error('Logout gagal');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const siteName = settings.site_name || 'Barkasiwa';
  const siteLogo = settings.site_logo;

  return (
    <header style={{ backgroundColor: '#1e4fa1' }} className="text-white shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              {siteLogo && (
                <div className="relative w-10 h-10">
                  <Image
                    src={getImageUrl(siteLogo)}
                    alt={siteName}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <span className="text-2xl font-bold">{siteName}</span>
            </Link>

            {/* Desktop Navigation - Only show categories when NOT logged in */}
            {!user && (
              <nav className="hidden lg:flex items-center gap-6 text-sm">
                <Link href="/products?category=1" style={{ color: '#eaf0ff' }} className="hover:text-white transition">
                  Elektronik
                </Link>
                <Link href="/products?category=2" style={{ color: '#eaf0ff' }} className="hover:text-white transition">
                  Buku
                </Link>
                <Link href="/products?category=3" style={{ color: '#eaf0ff' }} className="hover:text-white transition">
                  Fashion
                </Link>
                <Link href="/products?category=4" style={{ color: '#eaf0ff' }} className="hover:text-white transition">
                  Perlengkapan Kos
                </Link>
                <Link href="/products" style={{ color: '#eaf0ff' }} className="hover:text-white transition">
                  Semua Kategori
                </Link>
              </nav>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            {user ? (
              <>
                <ThemeToggle />
                <Link
                  href="/dashboard/products/new"
                  style={{ backgroundColor: '#ff8c42' }}
                  className="text-white px-5 py-2.5 rounded-lg font-bold hover:opacity-90 transition shadow-md"
                >
                  + Jual
                </Link>
                
                {/* Account Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.nama}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard/products"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard/wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Wishlist
                      </Link>
                      
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Profile
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Admin
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link href="/register" className="hover:text-gray-200 transition">
                  Register
                </Link>
                <Link href="/login" className="hover:text-gray-200 transition">
                  Login
                </Link>
                <Link
                  href="/login"
                  style={{ backgroundColor: '#ff8c42' }}
                  className="text-white px-5 py-2.5 rounded-lg font-bold hover:opacity-90 transition shadow-md"
                >
                  + Jual
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-400 pt-4">
            <nav className="flex flex-col gap-3">
              {!user && (
                <>
                  <Link href="/products?category=1" className="hover:text-gray-200 transition">
                    Elektronik
                  </Link>
                  <Link href="/products?category=2" className="hover:text-gray-200 transition">
                    Buku
                  </Link>
                  <Link href="/products?category=3" className="hover:text-gray-200 transition">
                    Fashion
                  </Link>
                  <Link href="/products?category=4" className="hover:text-gray-200 transition">
                    Perlengkapan Kos
                  </Link>
                  <Link href="/products" className="hover:text-gray-200 transition">
                    Semua Kategori
                  </Link>
                </>
              )}
              {user && (
                <>
                  <span className="text-sm">Halo, {user.nama}</span>
                  <Link href="/dashboard/products" className="hover:text-gray-200 transition">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="hover:text-gray-200 transition">
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="hover:text-gray-200 transition">
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-blue-400 my-2"></div>
                  <button onClick={handleLogout} className="text-left hover:text-gray-200 transition">
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
