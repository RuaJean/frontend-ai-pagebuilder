import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import WebsiteEditor from '@/features/websites/WebsiteEditor';
import WebsiteView from '@/features/websites/WebsiteView';
import { WebsiteDetails } from '@/types/websites';

type WebsitePageProps = {
  params: { slug: string };
  searchParams: { edit?: string };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function fetchWebsite(slug: string): Promise<WebsiteDetails | null> {
  try {
    const response = await fetch(`${API_URL}/api/websites/${slug}`, {
      next: { revalidate: 60 },
      cache: 'force-cache',
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
}

export const revalidate = 60;

export default async function WebsiteDetailPage({ params, searchParams }: WebsitePageProps) {
  const website = await fetchWebsite(params.slug);
  if (!website) {
    notFound();
  }

  const isEditing = searchParams?.edit === 'true';

  return (
    <div className="space-y-6">
      <WebsiteView website={website} />
      {isEditing ? (
        <ProtectedRoute>
          <WebsiteEditor websiteId={website.id} initialContent={website.contentJson} />
        </ProtectedRoute>
      ) : (
        <div className="flex justify-end">
          <Button asChild variant="secondary">
            <Link href={`/websites/${website.slug}?edit=true`}>Editar en el builder</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
