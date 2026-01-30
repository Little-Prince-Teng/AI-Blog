import { getNotes, getStatistics, getTags } from '@/lib/notes';
import { NoteCard } from '@/components/NoteCard';
import { getTranslations } from 'next-intl/server';
import { Lightbulb, BookOpen, Search, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function NotesPage({ params, searchParams }: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; tag?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { type, tag, q } = await searchParams;
  const t = await getTranslations('notes');
  
  let notes = await getNotes(locale);
  const statistics = await getStatistics(locale);
  const tags = await getTags(locale);
  
  if (type && (type === 'thought' || type === 'note')) {
    notes = notes.filter(note => note.type === type);
  }
  
  if (tag) {
    notes = notes.filter(note => note.tags.includes(tag));
  }
  
  if (q) {
    const lowerQuery = q.toLowerCase();
    notes = notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{t('title')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('total', { count: statistics.total })}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !type 
                  ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t('allNotes')}
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                type === 'thought' 
                  ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {t('thoughts')} ({statistics.thoughts})
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                type === 'note' 
                  ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t('notes')} ({statistics.notes})
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                defaultValue={q}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
              />
            </div>
            <Link
              href={`/${locale}/notes/new`}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
            >
              <Plus className="w-5 h-5" />
              {t('quickAdd')}
            </Link>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('tags')}:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tag ? (
                <a
                  href={`/${locale}/notes`}
                  className="px-3 py-1 bg-gradient-to-r from-amber-500 to-pink-600 text-white rounded-full text-sm font-medium"
                >
                  {tag} ×
                </a>
              ) : null}
              {tags.filter(t => t !== tag).map(tag => (
                <a
                  key={tag}
                  href={`/${locale}/notes?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {notes.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('noNotes')}
              </p>
            </div>
          ) : (
            notes.map((note, index) => (
              <NoteCard key={note.id} note={note} locale={locale} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
