import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/lib/i18n';

const messagesMap = {
  'zh': () => import('@/messages/zh.json').then(m => m.default),
  'en-US': () => import('@/messages/en-US.json').then(m => m.default),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  const messages = await messagesMap[locale as keyof typeof messagesMap]();

  return {
    locale,
    messages,
  };
});
