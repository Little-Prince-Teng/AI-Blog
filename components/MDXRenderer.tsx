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
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-p:mb-6 prose-ul:my-6 prose-ol:my-6 prose-li:mb-2 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-hr:border-gray-300 dark:prose-hr:border-gray-700"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <MDXComponent />
      </Suspense>
    </motion.div>
  );
}

export default MDXRenderer;
