import FirstPostEnUS from '@/content/articles/en-US/first-post.mdx';
import FirstPostZh from '@/content/articles/zh/first-post.mdx';

export const MDX_FILES = {
  'en-US': {
    'first-post': FirstPostEnUS,
  },
  'zh': {
    'first-post': FirstPostZh,
  },
} as const;

export function getMDXComponent(locale: string, slug: string) {
  const localeMap = MDX_FILES[locale as keyof typeof MDX_FILES];
  if (!localeMap) return null;
  return localeMap[slug as keyof typeof localeMap] || null;
}
