import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from './animations/FadeIn';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FadeIn>
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image
                  src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                  alt="فیدار تجارت سوبا"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-xl font-bold text-primary">فیدار تجارت سوبا</span>
              </Link>
              <p className="text-gray-600 text-sm">
                نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده با بهترین کیفیت و خدمات
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div>
              <h4 className="font-semibold mb-4 text-lg text-primary">دسترسی سریع</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                    خانه
                  </Link>
                </li>
                <li>
                  <Link href="/cars" className="text-gray-600 hover:text-primary transition-colors">
                    خودروها
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">
                    مقالات
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-600 hover:text-primary transition-colors">
                    اخبار
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div>
              <h4 className="font-semibold mb-4 text-lg text-primary">اطلاعات</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div>
              <h4 className="font-semibold mb-4 text-lg text-primary">تماس با ما</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>آدرس: تهران، خیابان ولیعصر</li>
                <li>تلفن: 021-12345678</li>
                <li>ایمیل: info@ftsmotors.com</li>
              </ul>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.4}>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} فیدار تجارت سوبا. تمامی حقوق محفوظ است.
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
