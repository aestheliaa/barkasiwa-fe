import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/Toast";
import { BottomNav } from "@/components/BottomNav";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAInit } from "@/components/PWAInit";
import { DynamicHead } from "@/components/DynamicHead";

export const metadata: Metadata = {
  title: "Barkasiwa - Marketplace Kampus",
  description: "Platform jual beli barang bekas antar mahasiswa",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Barkasiwa",
  },
};

export const viewport = {
  themeColor: "#1e4fa1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="Platform jual beli barang bekas antar mahasiswa" />
      </head>
      <body suppressHydrationWarning className="pb-20 md:pb-0 no-select">
        <ThemeProvider>
          <AuthProvider>
            <DynamicHead />
            <ToastProvider />
            <PWAInit />
            <WelcomeScreen />
            <PWAInstallPrompt />
            {children}
            <BottomNav />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}