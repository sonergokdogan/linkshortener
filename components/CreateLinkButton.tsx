'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateLinkDialog } from '@/components/CreateLinkDialog/CreateLinkDialog';
import { Button } from '@/components/ui/button';

interface CreateLinkButtonProps {
  onSuccess?: () => void;
}

export function CreateLinkButton({ onSuccess }: CreateLinkButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    onSuccess?.();
    setOpen(false);
    // Refresh the server component to show the new link
    router.refresh();
  };

  const handleClick = () => {
    console.log('Button clicked, current open state:', open);
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>Create Link</Button>
      <CreateLinkDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
