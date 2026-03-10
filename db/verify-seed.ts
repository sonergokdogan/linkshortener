import 'dotenv/config';
import { db } from './index';
import { links } from './schema';
import { eq } from 'drizzle-orm';

async function verifySeed() {
  const userId = 'user_3ARrx8pUzO4oK37sXmlVwgRYvDX';
  const result = await db.select().from(links).where(eq(links.userId, userId));
  console.log(result);
}

verifySeed();
