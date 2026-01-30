'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, BookOpen, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NewNotePage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const t = useTranslations('notes');
  const [locale, setLocale] = useState<string>('');
  const [type, setType] = useState<'thought' | 'note'>('thought');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mood, setMood] = useState('😊');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const moods = ['😊', '😐', '😔', '🤔', '💡', '🎉', '😴', '😤'];

  useEffect(() => {
    const initLocale = async () => {
      const { locale: loc } = await params;
      setLocale(loc);
    };
    initLocale();
  }, [params]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const noteData = {
      type,
      title,
      content,
      tags,
      date: new Date().toISOString().split('T')[0],
      locale,
      ...(type === 'thought' ? { mood } : {}),
      ...(type === 'note' ? { source, sourceUrl } : {}),
    };

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        router.push(`/${locale}/notes`);
      } else {
        alert('Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Error creating note');
    }
  };

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

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8">{t('createNote')}</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('type')}</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setType('thought')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    type === 'thought'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                  }`}
                >
                  <Lightbulb className={`w-6 h-6 mx-auto mb-2 ${type === 'thought' ? 'text-amber-500' : 'text-gray-400'}`} />
                  <span className="font-medium">{t('thought')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('note')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    type === 'note'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <BookOpen className={`w-6 h-6 mx-auto mb-2 ${type === 'note' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="font-medium">{t('note')}</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('title')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={t('titlePlaceholder')}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('content')}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                placeholder={t('contentPlaceholder')}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('tags')}</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder={t('tagPlaceholder')}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {t('add')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-pink-600 text-white rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {type === 'thought' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">{t('mood')}</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        mood === m ? 'bg-amber-100 dark:bg-amber-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {type === 'note' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">{t('source')}</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('sourcePlaceholder')}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">{t('sourceUrl')}</label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('sourceUrlPlaceholder')}
                  />
                </div>
              </>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
              >
                <Save className="w-5 h-5" />
                {t('save')}
              </button>
              <Link
                href={`/${locale}/notes`}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                {t('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
