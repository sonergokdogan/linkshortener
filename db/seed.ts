import 'dotenv/config';
import { db } from './index';
import { links } from './schema';

async function seedExampleLinks() {
  const userId = 'user_3ARrx8pUzO4oK37sXmlVwgRYvDX';
  
  const exampleLinks = [
    {
      userId,
      url: 'https://github.com/vercel/next.js',
      shortCode: 'nextjs',
      expiresAt: new Date('2026-12-31'),
    },
    {
      userId,
      url: 'https://tailwindcss.com/docs',
      shortCode: 'twdocs',
      expiresAt: null,
    },
    {
      userId,
      url: 'https://clerk.com/docs/quickstarts/nextjs',
      shortCode: 'clerkauth',
      expiresAt: new Date('2026-06-30'),
    },
    {
      userId,
      url: 'https://orm.drizzle.team/docs/overview',
      shortCode: 'drizzle',
      expiresAt: null,
    },
    {
      userId,
      url: 'https://neon.tech/docs/introduction',
      shortCode: 'neondb',
      expiresAt: new Date('2027-01-15'),
    },
    {
      userId,
      url: 'https://ui.shadcn.com/docs',
      shortCode: 'shadcnui',
      expiresAt: null,
    },
    {
      userId,
      url: 'https://vercel.com/docs/deployments/overview',
      shortCode: 'verceldep',
      expiresAt: new Date('2026-09-01'),
    },
    {
      userId,
      url: 'https://typescript-eslint.io/getting-started',
      shortCode: 'tslint',
      expiresAt: null,
    },
    {
      userId,
      url: 'https://react-hook-form.com/get-started',
      shortCode: 'rhf',
      expiresAt: new Date('2026-11-30'),
    },
    {
      userId,
      url: 'https://radix-ui.com/primitives/docs/overview/introduction',
      shortCode: 'radixui',
      expiresAt: null,
    },
  ];

  try {
    await db.insert(links).values(exampleLinks);
    console.log('✅ Successfully inserted 10 example links');
  } catch (error) {
    console.error('❌ Error inserting links:', error);
    process.exit(1);
  }
}

seedExampleLinks();
