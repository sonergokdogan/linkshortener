import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.userId, userId))
    .orderBy(desc(shortLinks.createdAt));

  return NextResponse.json({ data: links });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { originalUrl, title } = body as { originalUrl: string; title?: string };

    if (!originalUrl) {
      return NextResponse.json(
        { error: "originalUrl is required" },
        { status: 400 }
      );
    }

    // Generate a unique short code, retrying on collision
    let shortCode: string;
    let attempts = 0;
    while (true) {
      shortCode = Math.random().toString(36).slice(2, 8);
      const existing = await db
        .select({ id: shortLinks.id })
        .from(shortLinks)
        .where(eq(shortLinks.shortCode, shortCode))
        .limit(1);
      if (existing.length === 0) break;
      if (++attempts >= 5) {
        return NextResponse.json(
          { error: "Failed to generate unique short code" },
          { status: 500 }
        );
      }
    }

    const result = await db
      .insert(shortLinks)
      .values({
        id: crypto.randomUUID(),
        userId,
        originalUrl,
        shortCode,
        title: title ?? null,
      })
      .returning();

    return NextResponse.json({ data: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
