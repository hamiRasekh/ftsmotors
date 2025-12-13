import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'FTS Motors - نمایندگی خودرو',
    template: '%s | FTS Motors',
  },
  description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  keywords: ['خودرو', 'نمایندگی خودرو', 'فروش خودرو', 'خرید خودرو'],
  authors: [{ name: 'FTS Motors' }],
  creator: 'FTS Motors',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://ftsmotors.com',
    siteName: 'FTS Motors',
    title: 'FTS Motors - نمایندگی خودرو',
    description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FTS Motors - نمایندگی خودرو',
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
    <html lang="fa" dir="rtl">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

