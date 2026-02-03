import { NextRequest, NextResponse } from 'next/server';
import { getNotes, createNote, getNotesByType, getNotesByTag, searchNotes } from '@/lib/notes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'zh';
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const q = searchParams.get('q');

    let notes;
    
    if (type && (type === 'thought' || type === 'note')) {
      notes = await getNotesByType(type as 'thought' | 'note', locale);
    } else if (tag) {
      notes = await getNotesByTag(tag, locale);
    } else if (q) {
      notes = await searchNotes(q, locale);
    } else {
      notes = await getNotes(locale);
    }

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, title, content, tags, date, locale, mood, source, sourceUrl } = data;

    if (!type || !title || !content || !date || !locale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const USE_DATABASE = !!process.env.POSTGRES_URL;
    
    if (!USE_DATABASE) {
      return NextResponse.json({ 
        error: 'Note creation is only available in database mode. Please deploy to Vercel with Postgres enabled.' 
      }, { status: 501 });
    }

    const id = `${Date.now()}`;
    
    const note = await createNote({
      id,
      type,
      title,
      content,
      tags: tags || [],
      date,
      locale,
      mood,
      source,
      sourceUrl,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
