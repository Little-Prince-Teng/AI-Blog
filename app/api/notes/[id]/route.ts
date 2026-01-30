import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'zh';

    const notesDir = join(process.cwd(), 'content', 'notes', locale);
    const filePath = join(notesDir, `${id}.mdx`);
    
    const content = await readFile(filePath, 'utf-8');
    
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return NextResponse.json({ error: 'Invalid note format' }, { status: 400 });
    }

    const frontmatter = frontmatterMatch[1];
    const note: any = {
      id,
      locale,
    };

    frontmatter.split('\n').forEach(line => {
      const [key, ...values] = line.split(': ');
      if (key && values.length > 0) {
        let value = values.join(': ').trim();
        value = value.replace(/^"|"$/g, '');
        if (key === 'title') note.title = value;
        if (key === 'description') note.content = value;
        if (key === 'date') note.date = value;
        if (key === 'type') note.type = value;
        if (key === 'tags') {
          note.tags = value.replace(/\[|\]/g, '').split(',').map((tag: string) => tag.trim().replace(/^"|"$/g, ''));
        }
        if (key === 'mood') note.mood = value;
        if (key === 'source') note.source = value;
        if (key === 'sourceUrl') note.sourceUrl = value;
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { type, title, content, tags, date, locale, mood, source, sourceUrl } = data;

    if (!type || !title || !content || !date || !locale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notesDir = join(process.cwd(), 'content', 'notes', locale);
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

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'zh';

    const { unlink } = await import('fs/promises');
    const { join } = await import('path');

    const notesDir = join(process.cwd(), 'content', 'notes', locale);
    const filePath = join(notesDir, `${id}.mdx`);
    
    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
