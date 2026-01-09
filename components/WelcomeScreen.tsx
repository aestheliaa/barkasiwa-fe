'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export function WelcomeScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Mount check
  useEffect(() => {
    setMounted(true);
    loadSettings();
  }, []);

  // Check if should show (only after mounted)
  useEffect(() => {
    if (!mounted) return;
    
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    const isMobile = window.innerWidth < 768;
    
    if (!hasSeenWelcome && isMobile) {
      setShow(true);
    }
  }, [mounted]);

  const handleGetStarted = () => {
    setFadeOut(true);
    localStorage.setItem('hasSeenWelcome', 'true');
    
    setTimeout(() => {
      setShow(false);
    }, 300);
  };

  // Jangan render apapun sampai mounted di client
  if (!mounted || !show) return null;

  const siteName = settings.site_name || 'Barkasiwa';
  const siteDescription = settings.site_description || 'Marketplace terpercaya untuk jual beli barang bekas berkualitas';
  const siteLogo = settings.site_logo;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-primary via-primary-dark to-accent flex flex-col items-center justify-center px-6 transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo / Icon */}
      <div className="mb-8 animate-bounce">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4">
          {siteLogo ? (
            <div className="relative w-full h-full">
              <Image
                src={getImageUrl(siteLogo)}
                alt={siteName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <svg
              className="w-16 h-16 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-4 text-center animate-fade-in">
        Selamat Datang di
      </h1>
      <h2 className="text-5xl font-extrabold text-white mb-6 text-center animate-fade-in-delay">
        {siteName}
      </h2>

      {/* Description */}
      <p className="text-white/90 text-center text-lg mb-12 max-w-sm animate-fade-in-delay-2">
        {siteDescription}
      </p>

      {/* Features */}
      <div className="space-y-4 mb-12 w-full max-w-sm animate-fade-in-delay-3">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-lg">Produk Berkualitas</span>
        </div>
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-lg">Transaksi Aman</span>
        </div>
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-lg">Mudah Digunakan</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleGetStarted}
        className="w-full max-w-sm bg-white text-primary font-bold text-lg py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform animate-fade-in-delay-4"
      >
        Mulai Sekarang
      </button>

      {/* Skip */}
      <button
        onClick={handleGetStarted}
        className="mt-6 text-white/80 text-sm underline hover:text-white transition-colors"
      >
        Lewati
      </button>
    </div>
  );
}
