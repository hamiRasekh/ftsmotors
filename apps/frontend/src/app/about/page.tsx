import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">درباره ما</h1>
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-4">تاریخچه شرکت</h2>
              <p className="text-lg leading-relaxed mb-4">
                FTS Motors در سال 2000 با هدف ارائه بهترین خدمات در زمینه خرید و فروش خودرو
                تأسیس شد. ما با بیش از 20 سال تجربه، یکی از معتبرترین نمایندگی‌های خودرو در
                کشور هستیم.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                ما با تکیه بر تجربه و تخصص تیم خود، همواره تلاش کرده‌ایم تا بهترین خودروها را
                با مناسب‌ترین قیمت‌ها به مشتریان خود ارائه دهیم.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-4">ماموریت ما</h2>
              <p className="text-lg leading-relaxed mb-4">
                ماموریت ما ارائه خدمات با کیفیت و رضایت کامل مشتریان است. ما متعهد هستیم که:
              </p>
              <ul className="list-disc list-inside space-y-2 text-lg">
                <li>بهترین خودروها را با تضمین کیفیت ارائه دهیم</li>
                <li>خدمات پس از فروش عالی ارائه کنیم</li>
                <li>قیمت‌های منصفانه و شفاف داشته باشیم</li>
                <li>رضایت مشتری را در اولویت قرار دهیم</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-4">چرا ما را انتخاب کنید؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">تجربه و تخصص</h3>
                  <p className="text-muted-foreground">
                    بیش از 20 سال تجربه در زمینه خرید و فروش خودرو
                  </p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">گارانتی و تضمین</h3>
                  <p className="text-muted-foreground">
                    تمامی خودروهای ما با گارانتی و تضمین کیفیت ارائه می‌شوند
                  </p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">خدمات پس از فروش</h3>
                  <p className="text-muted-foreground">
                    خدمات پس از فروش کامل و پشتیبانی 24/7
                  </p>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">قیمت‌های منصفانه</h3>
                  <p className="text-muted-foreground">
                    بهترین قیمت‌ها با شفافیت کامل در معاملات
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

