'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { locales, defaultLocale } from '@/lib/i18n';

interface Article {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  locale: string;
}

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
      const data = await response.json();
      setSearchResults(data.articles || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, locale]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/${locale}/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchFocused(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const dropdownElement = dropdownRef.current;
    
    if (dropdownElement && relatedTarget) {
      if (!dropdownElement.contains(relatedTarget) && !searchRef.current?.contains(relatedTarget)) {
        setIsSearchFocused(false);
      }
    } else if (!relatedTarget) {
      setIsSearchFocused(false);
    }
  };

  const handleArticleClick = (article: Article) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    window.location.href = `/${locale}/blog/${article.slug}`;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href={buildHref('')} className="text-2xl font-bold shrink-0" prefetch={true}>
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

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={handleBlur}
                placeholder={t('search')}
                className={`pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isSearchFocused ? 'w-80' : 'w-64'}`}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <AnimatePresence>
                {isSearchFocused && (searchQuery.trim() || searchResults.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    ref={dropdownRef}
                    className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    style={{ width: isSearchFocused ? '20rem' : '16rem' }}
                  >
                    <div className="max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">搜索中...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div>
                          {searchResults.slice(0, 6).map((article, index) => (
                            <button
                              key={article.slug}
                              onClick={() => handleArticleClick(article)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 relative"
                              style={{ minHeight: '4rem' }}
                            >
                              <div className="absolute top-3 right-4">
                                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded">
                                  {article.category}
                                </span>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                    {article.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {article.description}
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                              </div>
                            </button>
                          ))}
                          {searchResults.length > 6 && (
                            <Link
                              href={`/${locale}/search?q=${encodeURIComponent(searchQuery)}`}
                              className="block px-4 py-3 text-sm text-blue-500 hover:text-blue-600 text-center border-t border-gray-100 dark:border-gray-700"
                            >
                              查看全部 {searchResults.length} 篇文章
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            未找到相关结果
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
