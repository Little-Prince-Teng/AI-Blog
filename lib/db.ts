import { sql } from '@vercel/postgres';

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
  created_at?: Date;
  updated_at?: Date;
}

export async function getNotes(locale: string): Promise<Note[]> {
  const { rows } = await sql<Note>`
    SELECT * FROM notes 
    WHERE locale = ${locale}
    ORDER BY date DESC
  `;
  return rows;
}

export async function getNoteById(id: string, locale: string): Promise<Note | null> {
  const { rows } = await sql<Note>`
    SELECT * FROM notes 
    WHERE id = ${id} AND locale = ${locale}
  `;
  return rows[0] || null;
}

export async function createNote(note: Omit<Note, 'created_at' | 'updated_at'>): Promise<Note> {
  const { rows } = await sql<Note>`
    INSERT INTO notes (id, type, title, content, tags, date, locale, mood, source, source_url)
    VALUES (${note.id}, ${note.type}, ${note.title}, ${note.content}, ${JSON.stringify(note.tags)}::text[], ${note.date}, ${note.locale}, ${note.mood}, ${note.source}, ${note.sourceUrl})
    RETURNING *
  `;
  return rows[0];
}

export async function updateNote(id: string, locale: string, note: Partial<Note>): Promise<Note | null> {
  const { rows } = await sql<Note>`
    UPDATE notes 
    SET 
      type = COALESCE(${note.type}, type),
      title = COALESCE(${note.title}, title),
      content = COALESCE(${note.content}, content),
      tags = COALESCE(${note.tags ? JSON.stringify(note.tags) : null}::text[], tags),
      date = COALESCE(${note.date}, date),
      mood = COALESCE(${note.mood}, mood),
      source = COALESCE(${note.source}, source),
      source_url = COALESCE(${note.sourceUrl}, source_url),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND locale = ${locale}
    RETURNING *
  `;
  return rows[0] || null;
}

export async function deleteNote(id: string, locale: string): Promise<boolean> {
  const { rowCount } = await sql`
    DELETE FROM notes 
    WHERE id = ${id} AND locale = ${locale}
  `;
  return (rowCount ?? 0) > 0;
}

export async function getNotesByType(type: 'thought' | 'note', locale: string): Promise<Note[]> {
  const { rows } = await sql<Note>`
    SELECT * FROM notes 
    WHERE locale = ${locale} AND type = ${type}
    ORDER BY date DESC
  `;
  return rows;
}

export async function getNotesByTag(tag: string, locale: string): Promise<Note[]> {
  const { rows } = await sql<Note>`
    SELECT * FROM notes 
    WHERE locale = ${locale} AND ${tag} = ANY(tags)
    ORDER BY date DESC
  `;
  return rows;
}

export async function searchNotes(query: string, locale: string): Promise<Note[]> {
  const lowerQuery = `%${query.toLowerCase()}%`;
  const { rows } = await sql<Note>`
    SELECT * FROM notes 
    WHERE locale = ${locale}
      AND (
        LOWER(title) LIKE ${lowerQuery}
        OR LOWER(content) LIKE ${lowerQuery}
        OR EXISTS (
          SELECT 1 FROM unnest(tags) AS tag
          WHERE LOWER(tag) LIKE ${lowerQuery}
        )
      )
    ORDER BY date DESC
  `;
  return rows;
}

export async function getTags(locale: string): Promise<string[]> {
  const { rows } = await sql<{ tags: string[] }>`
    SELECT DISTINCT array_agg(DISTINCT unnest(tags)) AS tags
    FROM notes 
    WHERE locale = ${locale}
  `;
  return rows[0]?.tags || [];
}

export async function getStatistics(locale: string): Promise<{
  total: number;
  thoughts: number;
  notes: number;
  tags: number;
}> {
  const { rows } = await sql<{ total: number; thoughts: number; notes_count: number; tags_count: number }>`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE type = 'thought') as thoughts,
      COUNT(*) FILTER (WHERE type = 'note') as notes_count,
      (SELECT COUNT(DISTINCT unnest(tags)) FROM notes WHERE locale = ${locale}) as tags_count
    FROM notes 
    WHERE locale = ${locale}
  `;
  
  return {
    total: rows[0]?.total || 0,
    thoughts: rows[0]?.thoughts || 0,
    notes: rows[0]?.notes_count || 0,
    tags: rows[0]?.tags_count || 0,
  };
}
