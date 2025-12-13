import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">FTS Motors</h3>
            <p className="text-sm text-muted-foreground">
              نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cars" className="text-muted-foreground hover:text-foreground">
                  خودروها
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  مقالات
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground">
                  اخبار
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">اطلاعات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">تماس با ما</h4>
            <p className="text-sm text-muted-foreground">
              آدرس: تهران، خیابان ولیعصر
              <br />
              تلفن: 021-12345678
              <br />
              ایمیل: info@ftsmotors.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FTS Motors. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

