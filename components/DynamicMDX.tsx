'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';

interface DynamicMDXProps {
  content: string;
}

export function DynamicMDX({ content }: DynamicMDXProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:mb-4 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-ul:my-4 prose-ol:my-4 prose-li:mb-2 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:font-mono prose-code:text-sm prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-2 prose-blockquote:pr-2 prose-blockquote:rounded-r-lg prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8 prose-strong:text-gray-900 dark:prose-strong:text-gray-100"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-bold mb-2">{children}</h4>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-200 dark:border-gray-700 shadow-lg">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4 bg-blue-50 dark:bg-gray-800 py-2 pr-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-gray-300 dark:border-gray-700" />,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
