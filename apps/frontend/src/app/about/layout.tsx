import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره ما',
  description:
    'فیدار تجارت سوبا - نمایندگی رسمی خودرو با بیش از 20 سال تجربه در زمینه خرید و فروش خودروهای جدید و کارکرده',
  keywords: ['درباره ما', 'فیدار تجارت سوبا', 'نمایندگی خودرو', 'تاریخچه'],
  openGraph: {
    title: 'درباره ما | فیدار تجارت سوبا',
    description:
      'فیدار تجارت سوبا - نمایندگی رسمی خودرو با بیش از 20 سال تجربه در زمینه خرید و فروش خودروهای جدید و کارکرده',
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
