import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { SlideIn } from '@/components/animations/SlideIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';

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

const values = [
  {
    icon: '🎯',
    title: 'تجربه و تخصص',
    description: 'بیش از 20 سال تجربه در زمینه خرید و فروش خودرو',
  },
  {
    icon: '🛡️',
    title: 'گارانتی و تضمین',
    description: 'تمامی خودروهای ما با گارانتی و تضمین کیفیت ارائه می‌شوند',
  },
  {
    icon: '🔧',
    title: 'خدمات پس از فروش',
    description: 'خدمات پس از فروش کامل و پشتیبانی 24/7',
  },
  {
    icon: '💰',
    title: 'قیمت‌های منصفانه',
    description: 'بهترین قیمت‌ها با شفافیت کامل در معاملات',
  },
];

const timeline = [
  { year: '2000', title: 'تأسیس', description: 'شروع فعالیت با هدف ارائه بهترین خدمات' },
  { year: '2005', title: 'گسترش', description: 'افزایش تعداد خودروها و خدمات' },
  { year: '2010', title: 'نوآوری', description: 'پیاده‌سازی سیستم‌های مدرن' },
  { year: '2020', title: 'تحول دیجیتال', description: 'راه‌اندازی پلتفرم آنلاین' },
  { year: '2024', title: 'پیشرو', description: 'یکی از برترین نمایندگی‌های کشور' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  درباره ما
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  FTS Motors با بیش از 20 سال تجربه، یکی از معتبرترین نمایندگی‌های خودرو در کشور است
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* History Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <SlideIn direction="right">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">تاریخچه شرکت</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    FTS Motors در سال 2000 با هدف ارائه بهترین خدمات در زمینه خرید و فروش خودرو
                    تأسیس شد. ما با بیش از 20 سال تجربه، یکی از معتبرترین نمایندگی‌های خودرو در
                    کشور هستیم.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    ما با تکیه بر تجربه و تخصص تیم خود، همواره تلاش کرده‌ایم تا بهترین خودروها را
                    با مناسب‌ترین قیمت‌ها به مشتریان خود ارائه دهیم.
                  </p>
                </div>
              </SlideIn>
              <SlideIn direction="left">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/img/pexels-hyundaimotorgroup-15865525.jpg"
                    alt="تاریخچه شرکت"
                    fill
                    className="object-cover"
                  />
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">خط زمانی ما</h2>
            </FadeIn>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
              <StaggerContainer className="space-y-12">
                {timeline.map((item, index) => (
                  <StaggerItem key={index}>
                    <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="relative z-10 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="w-1/2"></div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  چرا ما را انتخاب کنید؟
                </h2>
                <p className="text-xl text-gray-600">ارزش‌های ما</p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <StaggerItem key={index}>
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center">
                    <div className="text-5xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">ماموریت ما</h2>
                <p className="text-xl text-blue-100 leading-relaxed mb-8">
                  ماموریت ما ارائه خدمات با کیفیت و رضایت کامل مشتریان است. ما متعهد هستیم که:
                </p>
                <ul className="text-left space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>بهترین خودروها را با تضمین کیفیت ارائه دهیم</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>خدمات پس از فروش عالی ارائه کنیم</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>قیمت‌های منصفانه و شفاف داشته باشیم</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>رضایت مشتری را در اولویت قرار دهیم</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
