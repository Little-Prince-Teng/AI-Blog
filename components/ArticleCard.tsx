'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Article } from '@/lib/articles';

interface ArticleCardProps {
  article: Article;
  locale: string;
  index?: number;
}

export function ArticleCard({ article, locale, index = 0 }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{article.date}</span>
        <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
          {article.category}
        </span>
      </div>
      <Link href={`/${locale}/blog/${article.slug}`} className="block">
        <h2 className="text-xl md:text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {article.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readingTime} {locale === 'zh' ? '分钟' : 'min'}
          </span>
          <div className="flex gap-2 ml-auto flex-wrap">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
