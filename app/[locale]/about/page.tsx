import { getTranslations } from 'next-intl/server';
import { Github, Twitter, Linkedin, Mail, Heart, Code, Zap } from 'lucide-react';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('about');
  const isZh = locale === 'zh';

  const skills = [
    {
      icon: Code,
      title: isZh ? '前端开发' : 'Frontend Development',
      description: isZh ? 'React, Next.js, TypeScript' : 'React, Next.js, TypeScript',
    },
    {
      icon: Zap,
      title: isZh ? 'AI集成' : 'AI Integration',
      description: isZh ? 'OpenAI, Claude, AI应用开发' : 'OpenAI, Claude, AI App Development',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {isZh ? '联系方式' : 'Get in Touch'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Github className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Twitter className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Linkedin className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</span>
            </a>
            <a
              href="mailto:hello@example.com"
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Mail className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
