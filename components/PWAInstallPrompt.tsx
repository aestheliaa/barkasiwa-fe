'use client';

import { useState, useEffect } from 'react';

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Detect device type
function getDeviceType() {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  
  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  return 'desktop';
}

// Check if already installed
function isInstalled() {
  if (typeof window === 'undefined') return false;
  
  const nav = window.navigator as { standalone?: boolean };
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled()) return;

    const device = getDeviceType();
    
    // Use setTimeout to avoid setState in effect warning
    const initTimer = setTimeout(() => {
      setDeviceType(device);

      // Check if user already dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (dismissed && daysSinceDismissed < 7) return;

      // For iOS - show instructions after 3 seconds
      if (device === 'ios') {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, 0);

    // For Android/Desktop - wait for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleShowIOSInstructions = () => {
    setShowIOSInstructions(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  if (!showPrompt) return null;

  // iOS Instructions Modal
  if (showIOSInstructions && deviceType === 'ios') {
    return (
      <div className="fixed inset-0 z-[110] bg-black/50 flex items-end md:items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl max-w-md w-full p-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Install Barkasiwa di iOS
            </h3>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  Tap tombol Share
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tap icon <span className="inline-flex items-center mx-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </span> di bagian bawah browser
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  Pilih &quot;Add to Home Screen&quot;
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scroll ke bawah dan tap &quot;Add to Home Screen&quot;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  Tap &quot;Add&quot;
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Konfirmasi dengan tap tombol &quot;Add&quot; di pojok kanan atas
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleDismiss}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    );
  }

  // Install Banner
  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              Install Barkasiwa
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {deviceType === 'ios' 
                ? 'Install aplikasi untuk pengalaman yang lebih baik'
                : 'Install aplikasi untuk akses lebih cepat dan notifikasi'}
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              {deviceType === 'ios' ? (
                <button
                  onClick={handleShowIOSInstructions}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Cara Install
                </button>
              ) : (
                <button
                  onClick={handleInstallAndroid}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Install Sekarang
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
