import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            FTS Motors
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:text-primary">
                خانه
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-primary">
                خودروها
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary">
                مقالات
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-primary">
                اخبار
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                درباره ما
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                تماس با ما
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

