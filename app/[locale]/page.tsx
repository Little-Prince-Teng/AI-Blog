import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Code } from 'lucide-react';
import { locales, defaultLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('home');
  const currentLocale = locale || defaultLocale;

  return {
    title: t('welcome'),
    description: t('subtitle'),
    keywords: ['blog', '技术', '编程', 'AI', 'Next.js', 'frontend'],
    openGraph: {
      title: t('welcome'),
      description: t('subtitle'),
      type: 'website',
      locale: currentLocale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('welcome'),
      description: t('subtitle'),
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const currentLocale = locale || defaultLocale;

  const features = [
    {
      icon: BookOpen,
      title: currentLocale === 'zh' ? '优质内容' : 'Quality Content',
      description: currentLocale === 'zh' ? '精心撰写的文章，深入浅出' : 'Well-written articles, easy to understand',
    },
    {
      icon: Zap,
      title: currentLocale === 'zh' ? '快速加载' : 'Fast Loading',
      description: currentLocale === 'zh' ? '基于Next.js，极致性能' : 'Built with Next.js, ultimate performance',
    },
    {
      icon: Code,
      title: currentLocale === 'zh' ? '技术分享' : 'Tech Sharing',
      description: currentLocale === 'zh' ? '前沿技术，实战经验' : 'Cutting-edge tech, practical experience',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          {t('welcome')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href={`/${currentLocale}/blog`}
          className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg"
        >
          {t('viewAll')}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 md:mt-24">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('latestArticles')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
            {currentLocale === 'zh' ? '探索最新技术文章，获取前沿知识' : 'Explore latest tech articles and get cutting-edge knowledge'}
          </p>
          <Link
            href={`/${currentLocale}/blog`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-md"
          >
            {t('viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
