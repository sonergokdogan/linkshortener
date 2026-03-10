'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { updateLinkInDb } from '@/data/links';

const updateLinkSchema = z.object({
  linkId: z.number(),
  url: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(2, 'Short code must be at least 2 characters')
    .max(12, 'Short code must be at most 12 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLink(input: UpdateLinkInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const validatedInput = updateLinkSchema.parse(input);

    const updatedLink = await updateLinkInDb(
      validatedInput.linkId,
      userId,
      validatedInput.url,
      validatedInput.shortCode
    );

    if (!updatedLink) {
      return { error: 'Link not found or you do not have permission to edit it' };
    }

    return { success: true, link: updatedLink };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { error: firstError.message };
    }

    if (error instanceof Error) {
      if (error.message.includes('unique')) {
        return { error: 'Short code already in use. Please choose a different one.' };
      }
      return { error: error.message };
    }

    return { error: 'An unexpected error occurred' };
  }
}
