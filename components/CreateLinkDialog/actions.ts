'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLinkInDb } from '@/data/links';

// Define input schema
const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(2, 'Short code must be at least 2 characters')
    .max(12, 'Short code must be at most 12 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(input: CreateLinkInput) {
  try {
    // STEP 1: Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    // STEP 2: Validate input
    const validatedInput = createLinkSchema.parse(input);

    // STEP 3: Create link in database
    const newLink = await createLinkInDb(
      userId,
      validatedInput.url,
      validatedInput.shortCode
    );

    return { success: true, link: newLink };
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
