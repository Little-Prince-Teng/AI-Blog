import { NextRequest, NextResponse } from 'next/server';
import { getNote, updateNote, deleteNote } from '@/lib/notes';
import { updateNote as dbUpdateNote, deleteNote as dbDeleteNote } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'zh';

    const note = await getNote(id, locale);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'zh';

    const USE_DATABASE = !!process.env.POSTGRES_URL;
    
    if (!USE_DATABASE) {
      return NextResponse.json({ 
        error: 'Note update is only available in database mode. Please deploy to Vercel with Postgres enabled.' 
      }, { status: 501 });
    }

    const note = await dbUpdateNote(id, locale, data);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
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

    const USE_DATABASE = !!process.env.POSTGRES_URL;
    
    if (!USE_DATABASE) {
      return NextResponse.json({ 
        error: 'Note deletion is only available in database mode. Please deploy to Vercel with Postgres enabled.' 
      }, { status: 501 });
    }

    const success = await dbDeleteNote(id, locale);
    
    if (!success) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
