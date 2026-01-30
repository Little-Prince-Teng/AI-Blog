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

export async function getNotes(locale: string): Promise<Note[]> {
  const notes: Note[] = [];
  
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const notesDir = path.join(process.cwd(), 'content', 'notes', locale);
    const files = await fs.readdir(notesDir);
    
    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(notesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const note: Partial<Note> = {
            id: file.replace('.mdx', ''),
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
              if (key === 'type') note.type = value as 'thought' | 'note';
              if (key === 'tags') {
                note.tags = value.replace(/\[|\]/g, '').split(',').map(tag => tag.trim().replace(/^"|"$/g, ''));
              }
              if (key === 'mood') note.mood = value;
              if (key === 'source') note.source = value;
              if (key === 'sourceUrl') note.sourceUrl = value;
            }
          });
          
          if (note.title && note.content && note.date && note.type) {
            notes.push(note as Note);
          }
        }
      }
    }
    
    notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading notes:', error);
  }
  
  return notes;
}

export async function getNote(id: string, locale: string): Promise<Note | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const notesDir = path.join(process.cwd(), 'content', 'notes', locale);
    const filePath = path.join(notesDir, `${id}.mdx`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const note: Partial<Note> = {
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
          if (key === 'type') note.type = value as 'thought' | 'note';
          if (key === 'tags') {
            note.tags = value.replace(/\[|\]/g, '').split(',').map(tag => tag.trim().replace(/^"|"$/g, ''));
          }
          if (key === 'mood') note.mood = value;
          if (key === 'source') note.source = value;
          if (key === 'sourceUrl') note.sourceUrl = value;
        }
      });
      
      if (note.title && note.content && note.date && note.type) {
        return note as Note;
      }
    }
  } catch (error) {
    console.error('Error reading note:', error);
  }
  
  return null;
}

export async function getNoteContent(id: string, locale: string): Promise<string | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const notesDir = path.join(process.cwd(), 'content', 'notes', locale);
    const filePath = path.join(notesDir, `${id}.mdx`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    return bodyContent;
  } catch (error) {
    console.error('Error reading note content:', error);
  }
  
  return null;
}

export async function getTags(locale: string): Promise<string[]> {
  const notes = await getNotes(locale);
  const allTags = notes.flatMap(note => note.tags);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags.sort();
}

export async function getNotesByType(type: 'thought' | 'note', locale: string): Promise<Note[]> {
  const notes = await getNotes(locale);
  return notes.filter(note => note.type === type);
}

export async function getNotesByTag(tag: string, locale: string): Promise<Note[]> {
  const notes = await getNotes(locale);
  return notes.filter(note => note.tags.includes(tag));
}

export async function searchNotes(query: string, locale: string): Promise<Note[]> {
  const notes = await getNotes(locale);
  const lowerQuery = query.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export async function getStatistics(locale: string): Promise<{
  total: number;
  thoughts: number;
  notes: number;
  tags: number;
}> {
  const notes = await getNotes(locale);
  const tags = await getTags(locale);
  
  return {
    total: notes.length,
    thoughts: notes.filter(n => n.type === 'thought').length,
    notes: notes.filter(n => n.type === 'note').length,
    tags: tags.length,
  };
}
