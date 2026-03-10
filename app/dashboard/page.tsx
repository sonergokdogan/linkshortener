import { auth } from '@clerk/nextjs/server';
import { Card } from '@/components/ui/card';
import { getUserLinks } from '@/data/links';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  const userLinks = await getUserLinks(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Links</h1>
        <p className="text-gray-600 mt-2">
          {userLinks.length} link{userLinks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {userLinks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No links yet. Create your first link!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {userLinks.map((link) => (
            <Card key={link.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-semibold text-blue-600 truncate">
                    /{link.shortCode}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-700 hover:underline truncate block"
                    title={link.url}
                  >
                    {link.url}
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Created {new Date(link.createdAt!).toLocaleDateString()}
                {link.expiresAt && (
                  <>
                    {' '}
                    • Expires {new Date(link.expiresAt).toLocaleDateString()}
                  </>
                )}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
