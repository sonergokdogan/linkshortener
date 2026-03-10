'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { deleteLinkInDb } from '@/data/links';

const deleteLinkSchema = z.object({
  linkId: z.number(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLink(input: DeleteLinkInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const validatedInput = deleteLinkSchema.parse(input);

    const deletedLink = await deleteLinkInDb(validatedInput.linkId, userId);

    if (!deletedLink) {
      return { error: 'Link not found or you do not have permission to delete it' };
    }

    return { success: true, link: deletedLink };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { error: firstError.message };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'An unexpected error occurred' };
  }
}
