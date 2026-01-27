export const locales = ['zh', 'en-US'] as const;
export const defaultLocale = 'zh' as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1];
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}
