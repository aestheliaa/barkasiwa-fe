'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

// match exact or prefix (buat nested route)
function isRouteActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

type NavItemProps = {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode; // icon
};

function NavItem({ href, label, active, children }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex flex-col items-center justify-center text-xs font-medium py-1.5 px-2 flex-1 transition-colors select-none',
        active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
      )}
    >
      {children}
      <span className="mt-0.5">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname() ?? '/';
  const { user, isAdmin } = useAuth();

  const homeActive = isRouteActive(pathname, '/');
  const productsActive = isRouteActive(pathname, '/products');
  const wishlistActive = isRouteActive(pathname, '/dashboard/wishlist');
  const profileActive = isRouteActive(pathname, '/profile') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin');

  const sellHref = user ? '/dashboard/products/new' : '/login';
  const wishlistHref = user ? '/dashboard/wishlist' : '/login';
  const profileHref = user ? '/profile' : '/login';

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-50"
    >
      <div className="relative inline-flex w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5">
        {/* Home */}
        <NavItem href="/" label="Home" active={homeActive}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </NavItem>

        {/* Products */}
        <NavItem href="/products" label="Produk" active={productsActive}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </NavItem>

        {/* Center Button - Sell */}
        <Link
          href={sellHref}
          aria-label="Jual Produk"
          className="flex-1 inline-flex flex-col items-center justify-center py-1.5 px-2"
        >
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-7 p-2.5 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-accent to-accent-dark shadow-2xl hover:scale-110 active:scale-95 transition-transform">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <span className="mt-6 text-gray-700 dark:text-gray-300 font-semibold text-xs">
            Jual
          </span>
        </Link>

        {/* Wishlist */}
        <NavItem href={wishlistHref} label="Wishlist" active={wishlistActive}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </NavItem>

        {/* Profile */}
        <NavItem href={profileHref} label="Profil" active={profileActive}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </NavItem>
      </div>
    </nav>
  );
}
