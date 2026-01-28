import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const locale = searchParams.get('locale') || 'zh';

  if (!query) {
    return NextResponse.json({ articles: [] });
  }

  try {
    const articles = await getArticles(locale);
    const searchQuery = query.toLowerCase();

    const filteredArticles = articles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(searchQuery);
      const descriptionMatch = article.description.toLowerCase().includes(searchQuery);
      const tagsMatch = article.tags?.some(tag => 
        tag.toLowerCase().includes(searchQuery)
      );
      return titleMatch || descriptionMatch || tagsMatch;
    });

    return NextResponse.json({ articles: filteredArticles });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
