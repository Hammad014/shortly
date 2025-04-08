import { redirect } from 'next/navigation';
import Preview from '../../components/Preview';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params }) {
  const { shortCode } = params;
  let targetUrl = '/not-found';
  let metadata = null;

  try {
    // 1. Get target URL
    const analyticsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/click/${shortCode}`,
      { cache: 'no-store' }
    );

    if (analyticsResponse.status === 410) redirect('/expired');
    if (!analyticsResponse.ok) redirect('/not-found');

    const { redirectTo } = await analyticsResponse.json();
    targetUrl = redirectTo;

    // 2. Fetch metadata
    const metadataResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/metadata?url=${encodeURIComponent(targetUrl)}`
    );
    metadata = await metadataResponse.json();

  } catch (error) {
    console.error('Preview error:', error);
    redirect('/error');
  }

  return (
    <div className="min-h-screen ">
      <Preview targetUrl={targetUrl} metadata={metadata.meta} />
    </div>
  );
}