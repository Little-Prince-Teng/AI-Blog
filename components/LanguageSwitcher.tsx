'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, defaultLocale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  const isLocalePrefix = locales.includes(firstSegment as any);
  const remainingPath = isLocalePrefix ? segments.slice(1).join('/') : segments.join('/');

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    const newPath = remainingPath ? `/${newLocale}/${remainingPath}` : `/${newLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  const languageNames: Record<string, string> = {
    'zh': '中文',
    'en-US': 'English',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-sm">{languageNames[locale] || locale}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLanguage(loc)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                locale === loc ? 'text-blue-500 font-semibold' : ''
              }`}
            >
              {languageNames[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
