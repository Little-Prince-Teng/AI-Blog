'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/lib/notes';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface NoteActionsProps {
  note: Note;
  locale: string;
}

export function NoteActions({ note, locale }: NoteActionsProps) {
  const router = useRouter();
  const t = useTranslations('notes');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/notes/${note.id}?locale=${locale}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/${locale}/notes`);
      } else {
        alert('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
        <Link
          href={`/${locale}/notes/edit/${note.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          {t('edit')}
        </Link>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {t('delete')}
        </button>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}
