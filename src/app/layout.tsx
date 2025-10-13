import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from 'sonner';
import GoogleMapsLoader from '@/components/google-maps-loader/google-maps-loader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Velox - Planejador de Rotas de Bike',
  description: 'Planeje suas rotas de bike com precisão, calculando tempo, calorias e elevação personalizada.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Velox',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Velox',
    title: 'Velox - Planejador de Rotas de Bike',
    description: 'Planeje suas rotas de bike com precisão, calculando tempo, calorias e elevação personalizada.',
  },
  twitter: {
    card: 'summary',
    title: 'Velox - Planejador de Rotas de Bike',
    description: 'Planeje suas rotas de bike com precisão, calculando tempo, calorias e elevação personalizada.',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans">
        <AuthProvider>
          <GoogleMapsLoader>{children}</GoogleMapsLoader>
        </AuthProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
