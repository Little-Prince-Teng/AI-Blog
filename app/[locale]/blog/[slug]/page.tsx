import { getArticle } from '@/lib/articles';
import MDXRenderer from '@/components/MDXRenderer';
import { getTranslations } from 'next-intl/server';
import { Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ArticleDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('common');
  const article = await getArticle(slug, locale);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
            <h1 className="text-4xl font-bold mb-4">
              {locale === 'en-US' ? 'Article Not Found' : '文章未找到'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'en-US' ? 'The article you are looking for does not exist.' : '您查找的文章不存在。'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'zh' ? '返回文章列表' : 'Back to articles'}
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="text-sm text-gray-500 dark:text-gray-400">{article.date}</span>
              <span className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                {article.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{article.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{t('readingTime')}: {article.readingTime} {t('minutes')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex gap-2 flex-wrap">
                  {article.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-12">
            <MDXRenderer locale={locale} slug={slug} />
          </div>
        </article>

        <div className="mt-12 md:mt-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('relatedArticles')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'zh' ? '更多精彩内容即将推出...' : 'More exciting content coming soon...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
