'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router, pathname]);

  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'داشبورد', icon: '📊' },
    { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: '📁' },
    { href: '/admin/cars', label: 'خودروها', icon: '🚗' },
    { href: '/admin/articles', label: 'مقالات', icon: '📝' },
    { href: '/admin/news', label: 'اخبار', icon: '📰' },
    { href: '/admin/contact', label: 'پیام‌ها', icon: '✉️' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-2xl font-bold flex items-center gap-2">
              <span>⚙️</span>
              <span>پنل مدیریت</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/admin/login');
                }}
                className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
