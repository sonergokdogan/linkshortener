import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getUserLinks(userId: string) {
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));

  return userLinks;
}

export async function createLinkInDb(
  userId: string,
  url: string,
  shortCode: string,
  expiresAt?: Date
) {
  const now = new Date();
  const newLink = await db
    .insert(links)
    .values({
      userId,
      url,
      shortCode,
      expiresAt: expiresAt || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newLink[0];
}

export async function updateLinkInDb(
  linkId: number,
  userId: string,
  url: string,
  shortCode: string,
  expiresAt?: Date
) {
  const updatedLink = await db
    .update(links)
    .set({
      url,
      shortCode,
      expiresAt: expiresAt || null,
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  return updatedLink[0];
}

export async function deleteLinkInDb(linkId: number, userId: string) {
  const deletedLink = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  return deletedLink[0];
}
