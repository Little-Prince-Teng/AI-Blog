import { getArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { getTranslations } from 'next-intl/server';
import { FileText } from 'lucide-react';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const articles = await getArticles(locale);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{t('allArticles')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {articles.length} {t('articleCount')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {articles.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {locale === 'en-US' ? 'No articles yet' : '暂无文章'}
              </p>
            </div>
          ) : (
            articles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} locale={locale} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
