import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.shortCode, slug))
    .limit(1);

  if (link.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .update(shortLinks)
    .set({ clickCount: sql`${shortLinks.clickCount} + 1` })
    .where(eq(shortLinks.shortCode, slug));

  return NextResponse.redirect(link[0].originalUrl, 301);
}
