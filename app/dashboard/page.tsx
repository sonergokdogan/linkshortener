import { auth } from '@clerk/nextjs/server';
import { Card } from '@/components/ui/card';
import { getUserLinks } from '@/data/links';
import { CreateLinkButton } from '@/components/CreateLinkButton';
import { LinkCard } from '@/components/LinkCard';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  const userLinks = await getUserLinks(userId);

  return (
    <div className="space-y-6 px-[100px]">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Your Links</h1>
          <p className="text-gray-600 mt-2">
            {userLinks.length} link{userLinks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateLinkButton />
      </div>

      {userLinks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No links yet. Create your first link!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {userLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}
