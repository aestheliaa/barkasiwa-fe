'use client';

import { useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export function DynamicHead() {
  const updateManifest = useCallback((settings: Record<string, string>) => {
    if (typeof window === 'undefined') return;
    
    const manifestLink = document.querySelector("link[rel='manifest']") as HTMLLinkElement;
    if (manifestLink) {
      // Create dynamic manifest
      const manifest = {
        name: settings.site_name ? `${settings.site_name} - Marketplace Kampus` : 'Barkasiwa - Marketplace Kampus',
        short_name: settings.site_name || 'Barkasiwa',
        description: settings.site_description || 'Platform jual beli barang bekas khusus mahasiswa',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f5f7fb',
        theme_color: '#1e4fa1',
        orientation: 'portrait-primary',
        dir: 'ltr',
        lang: 'id',
        icons: settings.site_logo ? [
          {
            src: getImageUrl(settings.site_logo),
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: getImageUrl(settings.site_logo),
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: getImageUrl(settings.site_logo),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: getImageUrl(settings.site_logo),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ] : [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        categories: ['shopping', 'marketplace', 'lifestyle'],
        shortcuts: [
          {
            name: 'Lihat Produk',
            short_name: 'Produk',
            description: 'Browse semua produk yang tersedia',
            url: '/products',
            icons: settings.site_logo ? [{ src: getImageUrl(settings.site_logo), sizes: '192x192' }] : [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Jual Barang',
            short_name: 'Jual',
            description: 'Jual barang bekas kamu',
            url: '/dashboard/products/new',
            icons: settings.site_logo ? [{ src: getImageUrl(settings.site_logo), sizes: '192x192' }] : [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Wishlist',
            short_name: 'Wishlist',
            description: 'Lihat produk favorit kamu',
            url: '/dashboard/wishlist',
            icons: settings.site_logo ? [{ src: getImageUrl(settings.site_logo), sizes: '192x192' }] : [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ],
        prefer_related_applications: false
      };

      // Create blob URL for dynamic manifest
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);
      manifestLink.href = manifestURL;
    }
  }, []);

  const loadSettings = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const data = await api.getSettings();
      
      // Update document title
      if (data.site_name) {
        document.title = `${data.site_name} - Marketplace Kampus`;
      }
      
      // Update favicon if logo exists
      if (data.site_logo) {
        const logoUrl = `${getImageUrl(data.site_logo)}?t=${Date.now()}`;
        
        // Remove old favicon safely
        const oldFavicon = document.querySelector("link[rel='icon']");
        if (oldFavicon && oldFavicon.parentNode) {
          oldFavicon.parentNode.removeChild(oldFavicon);
        }
        
        // Create new favicon with timestamp to bypass cache
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = logoUrl;
        document.head.appendChild(favicon);
        
        // Remove old apple touch icon safely
        const oldAppleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
        if (oldAppleTouchIcon && oldAppleTouchIcon.parentNode) {
          oldAppleTouchIcon.parentNode.removeChild(oldAppleTouchIcon);
        }
        
        // Create new apple touch icon
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = logoUrl;
        document.head.appendChild(appleTouchIcon);
      }
      
      // Update meta description
      if (data.site_description) {
        let metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement;
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = data.site_description;
      }
      
      // Update PWA manifest dynamically
      if (data.site_name || data.site_description || data.site_logo) {
        updateManifest(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, [updateManifest]);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      loadSettings();
    }
  }, [loadSettings]);

  return null;
}
