import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links, clicks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  if (!shortcode) {
    return NextResponse.json(
      { error: 'Short code is required' },
      { status: 400 }
    );
  }

  try {
    // Find the link by shortcode
    const link = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortcode))
      .limit(1);

    if (!link || link.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const foundLink = link[0];

    // Check if the link has expired
    if (foundLink.expiresAt && new Date() > foundLink.expiresAt) {
      return NextResponse.json(
        { error: 'Link has expired' },
        { status: 410 }
      );
    }

    // Record the click for analytics
    try {
      await db.insert(clicks).values({
        linkId: foundLink.id,
        referrer: request.headers.get('referer') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    } catch (clickError) {
      // Log but don't fail the redirect if click recording fails
      console.error('Failed to record click:', clickError);
    }

    // Redirect to the original URL
    return NextResponse.redirect(foundLink.url, { status: 301 });
  } catch (error) {
    console.error('Error retrieving link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
