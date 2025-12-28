'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'مدیر');
        setUserEmail(userData.email || '');
        setUserPhone(userData.phone || '');
        setUserAvatar(userData.avatar || '');
      } catch {}
    }
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router, pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
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
    { href: '/admin/users', label: 'کاربران', icon: '👥' },
    { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: '📁' },
    { href: '/admin/cars', label: 'خودروها', icon: '🚗' },
    { href: '/admin/articles', label: 'مقالات', icon: '📝' },
    { href: '/admin/news', label: 'اخبار', icon: '📰' },
    { href: '/admin/pages', label: 'صفحات', icon: '📄' },
    { href: '/admin/media', label: 'کتابخانه رسانه', icon: '🖼️' },
    { href: '/admin/settings', label: 'تنظیمات', icon: '⚙️' },
    { href: '/admin/tickets', label: 'تیکت‌ها', icon: '🎫' },
    { href: '/admin/chat', label: 'چت', icon: '💬' },
    { href: '/admin/feedbacks', label: 'نظرات', icon: '💡' },
    { href: '/admin/contact', label: 'پیام‌ها', icon: '✉️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-l border-gray-200 fixed right-0 top-0 h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logos/loho.png"
              alt="فیدار تجارت سوبا"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold text-black">فیدار تجارت سوبا</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 w-full transition-colors"
          >
            <span className="text-lg">⚙️</span>
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 mr-64 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">سلام، {userName}!</h1>
            <div className="flex items-center gap-4">
              {/* Profile Menu */}
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  <svg
                    className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      {/* Overlay for closing menu */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[45]"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-[50] overflow-hidden"
                      >
                    {/* Profile Info */}
                    <div className="p-4 bg-gradient-to-r from-primary to-accent text-white">
                      <div className="flex items-center gap-3 mb-2">
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-lg">{userName}</p>
                          <p className="text-sm text-white/90">{userEmail || userPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/admin/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>پروفایل و تنظیمات</span>
                      </Link>
                      <Link
                        href="/admin/profile?tab=password"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>تغییر رمز عبور</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          router.push('/admin/login');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>خروج</span>
                      </button>
                    </div>
                  </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
