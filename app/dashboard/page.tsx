import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { LinksManager } from "@/components/links-manager";

export default async function Dashboard() {
  const { userId } = await auth();

  const links = userId
    ? await db
        .select()
        .from(shortLinks)
        .where(eq(shortLinks.userId, userId))
        .orderBy(desc(shortLinks.createdAt))
    : [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <LinksManager initialLinks={links} />
    </main>
  );
}
