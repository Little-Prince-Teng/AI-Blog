import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'articles';
    const locale = searchParams.get('locale') || 'zh';

    const contentDir = join(process.cwd(), 'content', type, locale);
    
    const files = await readdir(contentDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx'));
    
    const fileInfo = await Promise.all(mdxFiles.map(async (file) => {
      const filePath = join(contentDir, file);
      const content = await readFile(filePath, 'utf-8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      
      return {
        file,
        hasFrontmatter: !!frontmatterMatch,
        contentLength: content.length,
        preview: content.substring(0, 100),
      };
    }));

    return NextResponse.json({
      cwd: process.cwd(),
      contentDir,
      locale,
      type,
      totalFiles: files.length,
      mdxFiles: mdxFiles.length,
      files: fileInfo,
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      cwd: process.cwd(),
    }, { status: 500 });
  }
}
