import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'فیدار تجارت سوبا - نمایندگی خودرو',
    template: '%s | فیدار تجارت سوبا',
  },
  description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  keywords: ['خودرو', 'نمایندگی خودرو', 'فروش خودرو', 'خرید خودرو'],
  authors: [{ name: 'فیدار تجارت سوبا' }],
  creator: 'فیدار تجارت سوبا',
  icons: {
    icon: '/photo_2025-12-08_17-46-46-removebg-preview.png',
    shortcut: '/photo_2025-12-08_17-46-46-removebg-preview.png',
    apple: '/photo_2025-12-08_17-46-46-removebg-preview.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://ftsmotors.com',
    siteName: 'فیدار تجارت سوبا',
    title: 'فیدار تجارت سوبا - نمایندگی خودرو',
    description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فیدار تجارت سوبا - نمایندگی خودرو',
    description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
        <link rel="icon" type="image/png" href="/photo_2025-12-08_17-46-46-removebg-preview.png" />
        <link rel="shortcut icon" type="image/png" href="/photo_2025-12-08_17-46-46-removebg-preview.png" />
        <link rel="apple-touch-icon" href="/photo_2025-12-08_17-46-46-removebg-preview.png" />
        {/* Preload fonts for better performance */}
        <link
          rel="preload"
          href="/fonts/iranyekanwebregularfanum.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/iranyekanwebboldfanum.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/iranyekanwebextraboldfanum.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

