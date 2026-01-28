'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { locales, defaultLocale } from '@/lib/i18n';

export function MobileMenu() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  const isLocalePrefix = locales.includes(firstSegment as any);
  const locale = isLocalePrefix ? firstSegment : defaultLocale;
  const remainingPath = isLocalePrefix ? segments.slice(1).join('/') || '' : segments.join('/');

  const navItems = [
    { path: '', label: t('home'), key: 'home' },
    { path: 'blog', label: t('blog'), key: 'blog' },
    { path: 'search', label: t('search'), key: 'search' },
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

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={buildHref(item.path)}
                        onClick={handleNavClick}
                        className={`block px-4 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
