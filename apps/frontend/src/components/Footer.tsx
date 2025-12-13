import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                alt="FTS Motors Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <span className="text-2xl font-bold">FTS Motors</span>
            </Link>
            <p className="text-gray-400 text-sm">
              نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده با بهترین کیفیت و خدمات
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-gray-400 hover:text-white transition-colors">
                  خودروها
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  مقالات
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  اخبار
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">اطلاعات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">تماس با ما</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>آدرس: تهران، خیابان ولیعصر</li>
              <li>تلفن: 021-12345678</li>
              <li>ایمیل: info@ftsmotors.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} FTS Motors. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
