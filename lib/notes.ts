import { 
  getNotes as dbGetNotes, 
  getNoteById, 
  getNotesByType as dbGetNotesByType, 
  getNotesByTag as dbGetNotesByTag, 
  searchNotes as dbSearchNotes, 
  getTags as dbGetTags, 
  getStatistics as dbGetStatistics,
  updateNote as dbUpdateNote,
  deleteNote as dbDeleteNote,
  createNote as dbCreateNote,
} from './db';
import {
  getNotesFromFS,
  getNoteByIdFromFS,
  getNotesByTypeFromFS,
  getNotesByTagFromFS,
  searchNotesFromFS,
  getTagsFromFS,
  getStatisticsFromFS,
} from './notes-fs';

export interface Note {
  id: string;
  type: 'thought' | 'note';
  title: string;
  content: string;
  tags: string[];
  date: string;
  locale: string;
  mood?: string;
  source?: string;
  sourceUrl?: string;
}

const USE_DATABASE = !!process.env.POSTGRES_URL;

export async function getNotes(locale: string): Promise<Note[]> {
  if (USE_DATABASE) {
    return dbGetNotes(locale);
  }
  return getNotesFromFS(locale);
}

export async function getNote(id: string, locale: string): Promise<Note | null> {
  if (USE_DATABASE) {
    return getNoteById(id, locale);
  }
  return getNoteByIdFromFS(id, locale);
}

export async function getNoteContent(id: string, locale: string): Promise<string | null> {
  const note = await getNote(id, locale);
  return note?.content || null;
}

export async function getTags(locale: string): Promise<string[]> {
  if (USE_DATABASE) {
    return dbGetTags(locale);
  }
  return getTagsFromFS(locale);
}

export async function getNotesByType(type: 'thought' | 'note', locale: string): Promise<Note[]> {
  if (USE_DATABASE) {
    return dbGetNotesByType(type, locale);
  }
  return getNotesByTypeFromFS(type, locale);
}

export async function getNotesByTag(tag: string, locale: string): Promise<Note[]> {
  if (USE_DATABASE) {
    return dbGetNotesByTag(tag, locale);
  }
  return getNotesByTagFromFS(tag, locale);
}

export async function searchNotes(query: string, locale: string): Promise<Note[]> {
  if (USE_DATABASE) {
    return dbSearchNotes(query, locale);
  }
  return searchNotesFromFS(query, locale);
}

export async function getStatistics(locale: string): Promise<{
  total: number;
  thoughts: number;
  notes: number;
  tags: number;
}> {
  if (USE_DATABASE) {
    return dbGetStatistics(locale);
  }
  return getStatisticsFromFS(locale);
}

export async function createNote(note: Omit<Note, 'created_at' | 'updated_at'>): Promise<Note> {
  if (USE_DATABASE) {
    return dbCreateNote(note);
  }
  throw new Error('Note creation is only available in database mode');
}

export async function updateNote(id: string, locale: string, note: Partial<Note>): Promise<Note | null> {
  if (USE_DATABASE) {
    return dbUpdateNote(id, locale, note);
  }
  return null;
}

export async function deleteNote(id: string, locale: string): Promise<boolean> {
  if (USE_DATABASE) {
    return dbDeleteNote(id, locale);
  }
  return false;
}
