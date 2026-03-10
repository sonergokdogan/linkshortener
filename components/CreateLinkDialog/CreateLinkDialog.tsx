'use client';

import { useState } from 'react';
import { createLink } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (link: Record<string, unknown>) => void;
}

export function CreateLinkDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    shortCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createLink({
        url: formData.url,
        shortCode: formData.shortCode,
      });

      if ('error' in result) {
        setError(result.error || 'An unexpected error occurred');
      } else {
        // Success - reset form and close dialog
        setFormData({ url: '', shortCode: '' });
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-6 rounded-lg shadow-2xl border border-slate-800 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5 mb-4">
          <h2 className="text-lg font-semibold text-white">Create New Link</h2>
          <p className="text-sm text-slate-400">
            Shorten your URL and create a custom short code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL to Shorten</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={formData.url}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortCode">Short Code</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">/</span>
              <Input
                id="shortCode"
                name="shortCode"
                type="text"
                placeholder="my-link"
                value={formData.shortCode}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                maxLength={12}
              />
            </div>
          </div>

          {error && (
            <div className="rounded bg-red-950 p-3 text-sm text-red-400 border border-red-800">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
