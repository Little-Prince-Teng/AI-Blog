'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { motion } from 'framer-motion';
import { locales, defaultLocale } from '@/lib/i18n';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  const isLocalePrefix = locales.includes(firstSegment as any);
  const locale = isLocalePrefix ? firstSegment : defaultLocale;
  const remainingPath = isLocalePrefix ? segments.slice(1).join('/') || '' : segments.join('/');

  const navItems = [
    { path: '', label: t('home'), key: 'home' },
    { path: 'blog', label: t('blog'), key: 'blog' },
    { path: 'about', label: t('about'), key: 'about' },
  ];

  const isActive = (path: string) => {
    if (path === '') {
      return remainingPath === '' || remainingPath === '';
    }
    return remainingPath.startsWith(path);
  };

  const buildHref = (path: string) => {
    if (locale === defaultLocale) {
      return path ? `/${path}` : '/';
    }
    return path ? `/${locale}/${path}` : `/${locale}`;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={buildHref('')} className="text-2xl font-bold" prefetch={true}>
            My Blog
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={buildHref(item.path)}
                prefetch={true}
                className={`hover:text-blue-500 transition-colors ${
                  isActive(item.path) ? 'text-blue-500 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <MobileMenu />
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
