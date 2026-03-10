---
description: Use this guide when implementing data mutations, handling form submissions, or creating server actions in the application. Ensures all server actions follow the required pattern for validation, authentication, and database access.
---

# Server Actions Instructions

All data mutations in this application **must** be implemented using Next.js Server Actions. Follow these standards strictly to maintain consistency and security.

## Overview

- **All mutations** → Server Actions
- **Server Actions** → Called from client components only
- **File naming** → `actions.ts` (co-located with the component)
- **Type safety** → No `FormData` type; use proper TypeScript types
- **Validation** → Zod schema validation (required)
- **Authentication** → Check for logged-in user first (required)
- **Database** → Use helper functions in `/data` directory (no direct Drizzle queries)

## File Structure

Server action files must be named `actions.ts` and placed in the **same directory** as the client component that calls them.

```
components/
  MyComponent/
    MyComponent.tsx          # Client component
    actions.ts               # Server actions
```

## Implementation Pattern

### 1. Define Client Component (e.g., `components/CreateLinkForm/CreateLinkForm.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { createLink } from './actions';

export function CreateLinkForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const url = formData.get('url') as string;
      const shortCode = formData.get('shortCode') as string;

      const result = await createLink({ url, shortCode });

      if ('error' in result) {
        setError(result.error);
      } else {
        // Handle success
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="url" type="url" required />
      <input name="shortCode" type="text" required />
      <button type="submit">{isLoading ? 'Loading...' : 'Create'}</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### 2. Define Server Action (e.g., `components/CreateLinkForm/actions.ts`)

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLinkInDb } from '@/data/links';

// Define input schema
const createLinkSchema = z.object({
  url: z.string().url('Invalid URL'),
  shortCode: z.string().min(2).max(10),
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
    const validatedData = createLinkSchema.parse(input);

    // STEP 3: Call data helper (never Drizzle directly)
    const result = await createLinkInDb({
      userId,
      url: validatedData.url,
      shortCode: validatedData.shortCode,
    });

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.errors };
    }
    return { error: 'Database error' };
  }
}
```

### 3. Define Data Helper (e.g., `data/links.ts`)

```typescript
import { db } from '@/db';
import { linksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createLinkInDb({
  userId,
  url,
  shortCode,
}: {
  userId: string;
  url: string;
  shortCode: string;
}) {
  const result = await db
    .insert(linksTable)
    .values({
      userId,
      url,
      shortCode,
      createdAt: new Date(),
    })
    .returning();

  return result[0];
}

export async function getLinkByShortCode(shortCode: string) {
  const result = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.shortCode, shortCode));

  return result[0] || null;
}
```

## Key Rules

### ✅ Type Safety
- Define explicit TypeScript interfaces or Zod schemas for all inputs
- **Never use `FormData` as a type** — extract values and type them properly
- Example:
  ```typescript
  // ❌ Wrong
  async function myAction(formData: FormData) { ... }

  // ✅ Correct
  async function myAction(input: { name: string; email: string }) { ... }
  ```

### ✅ Validation
- All server actions **must** use Zod for input validation
- Validation happens **before** any database operations
- Return validation errors to the client

### ✅ Authentication
- Always check `await auth()` from Clerk **first**
- Return early if user is not authenticated
- Extract `userId` and use it for database operations
- Example:
  ```typescript
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }
  ```

### ✅ Database Access
- **Never use Drizzle queries directly in server actions**
- Always use helper functions from `/data` directory
- Helper functions should wrap all Drizzle operations
- Server actions orchestrate: auth → validate → call data helpers

### ✅ Error Handling
- **Never throw errors from server actions** — always catch and return them
- Catch and handle errors gracefully
- Return structured error responses to the client as `{ error: string }` objects
- Log unexpected errors for debugging (do not expose sensitive details)
- Example:
  ```typescript
  // ❌ Wrong
  export async function myAction(input: Data) {
    throw new Error('Something went wrong');
  }

  // ✅ Correct
  export async function myAction(input: Data) {
    try {
      // logic here
      return { success: true, data: result };
    } catch (error) {
      return { error: 'Something went wrong' };
    }
  }
  ```

## Anti-Patterns

```typescript
// ❌ DO NOT: Throw errors
async function badAction(input: Data) {
  throw new Error('Something went wrong');
}

// ❌ DO NOT: Use FormData as a type
async function badAction(formData: FormData) { ... }

// ❌ DO NOT: Skip authentication check
async function badAction(input: Data) {
  // Missing auth check!
  await db.insert(...);
}

// ❌ DO NOT: Use Drizzle directly in server action
async function badAction(input: Data) {
  const result = await db.insert(...); // Wrong!
}

// ❌ DO NOT: Skip validation
async function badAction(input: Data) {
  // Missing zod validation!
  await createLinkInDb(input);
}
```

## Response Format

Return consistent response objects from server actions:

```typescript
// Success
{ success: true, data: {...} }

// Validation error
{ error: 'Validation failed', details: [...] }

// Auth error
{ error: 'Unauthorized' }

// Other errors
{ error: 'Database error' }
```

## Testing Server Actions

- Test validation separately with Zod
- Test database helpers independently
- Mock Clerk's `auth()` function in tests
- Verify authentication checks are called before DB operations
