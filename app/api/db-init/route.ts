import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('thought', 'note')),
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        date VARCHAR(50) NOT NULL,
        locale VARCHAR(10) NOT NULL,
        mood VARCHAR(50),
        source VARCHAR(500),
        source_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_locale ON notes(locale);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date DESC);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to initialize database' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { rows } = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tables = rows.map((row: any) => row.table_name);
    const notesTableExists = tables.includes('notes');
    
    return NextResponse.json({
      notesTableExists,
      tables,
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to check database' 
    }, { status: 500 });
  }
}
