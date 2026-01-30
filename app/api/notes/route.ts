import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, title, content, tags, date, locale, mood, source, sourceUrl } = data;

    if (!type || !title || !content || !date || !locale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = `${Date.now()}`;
    const notesDir = join(process.cwd(), 'content', 'notes', locale);
    
    await mkdir(notesDir, { recursive: true });

    const frontmatter = `---
title: "${title}"
description: "${content}"
date: "${date}"
type: "${type}"
tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]
${mood ? `mood: "${mood}"` : ''}
${source ? `source: "${source}"` : ''}
${sourceUrl ? `sourceUrl: "${sourceUrl}"` : ''}
---

${content}
`;

    const filePath = join(notesDir, `${id}.mdx`);
    await writeFile(filePath, frontmatter, 'utf-8');

    return NextResponse.json({ id, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
