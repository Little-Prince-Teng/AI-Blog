import { getNote, getNoteContent, getNotesByTag } from '@/lib/notes';
import { DynamicMDX } from '@/components/DynamicMDX';
import { Lightbulb, BookOpen, Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Note } from '@/lib/notes';
import { getTranslations } from 'next-intl/server';
import { NoteActions } from '@/components/NoteActions';

export default async function NoteDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations('notes');
  const note = await getNote(id, locale);
  const content = await getNoteContent(id, locale);

  if (!note) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t('noteNotFound')}</h1>
          <Link href={`/${locale}/notes`} className="text-blue-500 hover:text-blue-600">
            {t('backToNotes')}
          </Link>
        </div>
      </div>
    );
  }

  const relatedNotes = await getNotesByTag(note.tags[0] || '', locale);
  const filteredRelatedNotes = relatedNotes.filter(n => n.id !== id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/notes`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToNotes')}
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className={`p-6 md:p-8 ${
            note.type === 'thought' 
              ? 'bg-gradient-to-r from-amber-500 to-pink-600' 
              : 'bg-gradient-to-r from-blue-500 to-green-600'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {note.type === 'thought' ? (
                <Lightbulb className="w-6 h-6 text-white" />
              ) : (
                <BookOpen className="w-6 h-6 text-white" />
              )}
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                {note.type === 'thought' ? t('thought') : t('note')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{note.date}</span>
              </div>
              {note.mood && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{note.mood}</span>
                </div>
              )}
              {note.source && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{note.source}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {note.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag className="w-4 h-4 text-gray-500" />
                {note.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/${locale}/notes?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {content && (
              <div className="prose dark:prose-invert max-w-none">
                <DynamicMDX content={content} />
              </div>
            )}

            <NoteActions note={note} locale={locale} />
          </div>
        </article>

        {filteredRelatedNotes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('relatedNotes')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelatedNotes.map((relatedNote) => (
                <Link
                  key={relatedNote.id}
                  href={`/${locale}/notes/${relatedNote.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {relatedNote.type === 'thought' ? (
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm text-gray-500">{relatedNote.date}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{relatedNote.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {relatedNote.content}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
