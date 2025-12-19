import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره ما',
  description:
    'FTS Motors - نمایندگی رسمی خودرو با بیش از 20 سال تجربه در زمینه خرید و فروش خودروهای جدید و کارکرده',
  keywords: ['درباره ما', 'FTS Motors', 'نمایندگی خودرو', 'تاریخچه'],
  openGraph: {
    title: 'درباره ما | FTS Motors',
    description:
      'FTS Motors - نمایندگی رسمی خودرو با بیش از 20 سال تجربه در زمینه خرید و فروش خودروهای جدید و کارکرده',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
