'use client';

import { useState } from 'react';
import { deleteLink } from './actions';
import { Button } from '@/components/ui/button';

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    id: number;
    shortCode: string;
  };
  onSuccess?: (link: Record<string, unknown>) => void;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
  onSuccess,
}: DeleteLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await deleteLink({
        linkId: link.id,
      });

      if ('error' in result) {
        setError(result.error || 'An unexpected error occurred');
      } else {
        onOpenChange(false);
        onSuccess?.(result.link);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-6 rounded-lg shadow-2xl border border-slate-800 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Delete Link</h2>
            <p className="text-sm text-slate-400 mt-1">
              Are you sure you want to delete the link <span className="font-mono text-blue-400">/{link.shortCode}</span>?
            </p>
            <p className="text-xs text-slate-500 mt-2">
              This action cannot be undone.
            </p>
          </div>

          {error && (
            <div className="rounded bg-red-950 p-3 text-sm text-red-400 border border-red-800">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
