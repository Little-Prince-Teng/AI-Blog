import { NextResponse, NextRequest } from 'next/server';
import { getArticles } from '@/lib/articles';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'zh';

  try {
    const articles = await getArticles(locale);
    return NextResponse.json({
      success: true,
      locale,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('Test articles API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
