'use client';

import { motion } from 'framer-motion';
import { Suspense } from 'react';

interface MDXContentProps {
  children: React.ReactNode;
}

export function MDXContent({ children }: MDXContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="prose prose-lg dark:prose-invert max-w-none"
    >
      {children}
    </motion.div>
  );
}
