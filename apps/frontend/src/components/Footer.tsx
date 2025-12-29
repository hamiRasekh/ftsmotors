'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from './animations/FadeIn';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterContent {
  logo?: string;
  logoAlt?: string;
  companyName?: string;
  description?: string;
  quickLinks?: FooterLink[];
  infoLinks?: FooterLink[];
  address?: string;
  phone?: string;
  phones?: string[];
  email?: string;
  copyrightText?: string;
}

export function Footer() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.footerContent.getPublic();
        setContent(data);
      } catch (error) {
        console.error('Error fetching footer content:', error);
        // Fallback to default content
        setContent({
          logo: '/logos/loho.png',
          logoAlt: 'فیدار تجارت سوبا',
          companyName: 'فیدار تجارت سوبا',
          description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده با بهترین کیفیت و خدمات',
          quickLinks: [
            { href: '/', label: 'خانه' },
            { href: '/cars', label: 'خودروها' },
            { href: '/blog', label: 'مقالات' },
            { href: '/news', label: 'اخبار' },
          ],
          infoLinks: [
            { href: '/about', label: 'درباره ما' },
            { href: '/contact', label: 'تماس با ما' },
          ],
          address: 'تهران، خیابان ولیعصر',
          phone: '021-12345678',
          email: 'info@ftsmotors.com',
          copyrightText: `© ${new Date().getFullYear()} فیدار تجارت سوبا. تمامی حقوق محفوظ است.`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading || !content) {
    return (
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-500">در حال بارگذاری...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FadeIn>
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                {content.logo && (
                  <Image
                    src={content.logo}
                    alt={content.logoAlt || 'فیدار تجارت سوبا'}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
                {content.companyName && (
                  <span className="text-xl font-bold text-primary">{content.companyName}</span>
                )}
              </Link>
              {content.description && (
                <p className="text-gray-600 text-sm">{content.description}</p>
              )}
            </div>
          </FadeIn>
          
          {content.quickLinks && content.quickLinks.length > 0 && (
            <FadeIn delay={0.1}>
              <div>
                <h4 className="font-semibold mb-4 text-lg text-primary">دسترسی سریع</h4>
                <ul className="space-y-2 text-sm">
                  {content.quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          )}
          
          {content.infoLinks && content.infoLinks.length > 0 && (
            <FadeIn delay={0.2}>
              <div>
                <h4 className="font-semibold mb-4 text-lg text-primary">اطلاعات</h4>
                <ul className="space-y-2 text-sm">
                  {content.infoLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          )}
          
          {(content.address || content.phone || content.phones || content.email) && (
            <FadeIn delay={0.3}>
              <div>
                <h4 className="font-semibold mb-4 text-lg text-primary">تماس با ما</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {content.address && <li>آدرس: {content.address}</li>}
                  {content.phones && Array.isArray(content.phones) && content.phones.length > 0 ? (
                    content.phones.map((phone, index) => (
                      <li key={index}>تلفن: {phone}</li>
                    ))
                  ) : content.phone ? (
                    <li>تلفن: {content.phone}</li>
                  ) : null}
                  {content.email && <li>ایمیل: {content.email}</li>}
                </ul>
              </div>
            </FadeIn>
          )}
        </div>
        <FadeIn delay={0.4}>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            {content.copyrightText || `© ${new Date().getFullYear()} فیدار تجارت سوبا. تمامی حقوق محفوظ است.`}
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
