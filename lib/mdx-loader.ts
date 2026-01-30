import FirstPostEnUS from '@/content/articles/en-US/first-post.mdx';
import FirstPostZh from '@/content/articles/zh/first-post.mdx';
import AiEvolutionEnUS from '@/content/articles/en-US/ai-evolution.mdx';
import AiEvolutionZh from '@/content/articles/zh/ai-evolution.mdx';

export const MDX_FILES = {
  'en-US': {
    'first-post': FirstPostEnUS,
    'ai-evolution': AiEvolutionEnUS,
  },
  'zh': {
    'first-post': FirstPostZh,
    'ai-evolution': AiEvolutionZh,
  },
} as const;

export function getMDXComponent(locale: string, slug: string) {
  const localeMap = MDX_FILES[locale as keyof typeof MDX_FILES];
  if (!localeMap) return null;
  return localeMap[slug as keyof typeof localeMap] || null;
}
