'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditLinkDialog } from '@/components/EditLinkDialog/EditLinkDialog';
import { DeleteLinkDialog } from '@/components/DeleteLinkDialog/DeleteLinkDialog';

interface LinkCardProps {
  link: {
    id: number;
    shortCode: string;
    url: string;
    createdAt: Date | null;
    expiresAt: Date | null;
  };
}

export function LinkCard({ link }: LinkCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditSuccess = () => {
    setEditOpen(false);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    router.refresh();
  };

  return (
    <>
      <Card className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-semibold text-blue-600 truncate">
              /{link.shortCode}
            </p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:underline truncate block"
              title={link.url}
            >
              {link.url}
            </a>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setEditOpen(true)}
              title="Edit link"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              title="Delete link"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Created {new Date(link.createdAt!).toLocaleDateString()}
          {link.expiresAt && (
            <>
              {' '}
              • Expires {new Date(link.expiresAt).toLocaleDateString()}
            </>
          )}
        </p>
      </Card>

      <EditLinkDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        link={link}
        onSuccess={handleEditSuccess}
      />

      <DeleteLinkDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        link={link}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
