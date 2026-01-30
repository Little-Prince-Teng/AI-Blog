'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, deleting }: DeleteConfirmDialogProps) {
  const t = useTranslations('notes');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold">{t('deleteConfirmTitle')}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('deleteConfirmMessage')}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('deleting')}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {t('confirmDelete')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
