'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Note } from '@/lib/notes';
import { Lightbulb, BookOpen, Tag } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  locale: string;
  index?: number;
}

export function NoteCard({ note, locale, index = 0 }: NoteCardProps) {
  const isThought = note.type === 'thought';

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
        <span className="text-sm text-gray-500 dark:text-gray-400">{note.date}</span>
        <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${
          isThought 
            ? 'bg-gradient-to-r from-amber-500 to-pink-600' 
            : 'bg-gradient-to-r from-blue-500 to-green-600'
        }`}>
          {isThought ? (
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              {locale === 'zh' ? '杂想' : 'Thought'}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {locale === 'zh' ? '笔记' : 'Note'}
            </span>
          )}
        </span>
      </div>

      <Link href={`/${locale}/notes/${note.id}`} className="block">
        <h2 className="text-xl md:text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
          {note.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {note.content}
        </p>

        <div className="flex items-center gap-3">
          {isThought && note.mood && (
            <span className="text-2xl">{note.mood}</span>
          )}
          {!isThought && note.source && (
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {note.source}
            </span>
          )}
          <div className="flex gap-2 ml-auto flex-wrap">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
