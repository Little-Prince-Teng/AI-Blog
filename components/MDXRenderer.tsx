'use client';

import { motion } from 'framer-motion';
import { getMDXComponent } from '@/lib/mdx-loader';
import { Suspense } from 'react';

interface MDXRendererProps {
  locale: string;
  slug: string;
}

function MDXRenderer({ locale, slug }: MDXRendererProps) {
  const MDXComponent = getMDXComponent(locale, slug);

  if (!MDXComponent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          {locale === 'en-US' ? 'Content not found' : '内容未找到'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-xl md:prose-h3:text-2xl prose-p:leading-relaxed prose-p:mb-4 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-ul:my-4 prose-ol:my-4 prose-li:mb-2 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:font-mono prose-code:text-sm prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-2 prose-blockquote:pr-2 prose-blockquote:rounded-r-lg prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-img:rounded-lg prose-img:shadow-md"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <MDXComponent />
      </Suspense>
    </motion.div>
  );
}

export default MDXRenderer;
