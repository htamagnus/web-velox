import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { LocaleProvider } from '@/contexts/locale-context';
import { Toaster } from 'sonner';
import GoogleMapsLoader from '@/components/google-maps-loader/google-maps-loader';
import { archivo } from './fonts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://web-velox.vercel.app'),
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
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Velox: o tempo da rota na sua velocidade' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velox - Planejador de Rotas de Bike',
    description: 'Planeje suas rotas de bike com precisão, calculando tempo, calorias e elevação personalizada.',
    images: ['/og.jpg'],
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
        <LocaleProvider>
          <AuthProvider>
            <GoogleMapsLoader>{children}</GoogleMapsLoader>
          </AuthProvider>
          <Toaster position="top-center" className={`toaster ${archivo.variable}`} toastOptions={{ unstyled: true, className: 'toast' }} />
        </LocaleProvider>
      </body>
    </html>
  );
}
