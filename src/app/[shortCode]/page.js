// //[shortcode]/page.js


import { redirect } from 'next/navigation';
import Preview from '../components/Preview';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { shortCode } = params;
  let targetUrl = '/not-found';
  let metadata = null;

  try {
    // 1. Track the click and get target URL
    const analyticsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/click/${shortCode}`,
      { cache: 'no-store' }
    );

    if (analyticsResponse.status === 410) {
      redirect('/expired');
    }

    if (analyticsResponse.ok) {
      const data = await analyticsResponse.json();
      targetUrl = data.redirectTo;
    }

    // 2. Fetch website metadata
    const metadataResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/metadata?url=${encodeURIComponent(targetUrl)}`
    );
    metadata = await metadataResponse.json();

  } catch (error) {
    console.error('Redirect error:', error);
    targetUrl = '/error';
  }

  return <Preview targetUrl={targetUrl} metadata={metadata.meta} />;
}

// import { redirect } from 'next/navigation';

// export const dynamic = 'force-dynamic';

// export default async function RedirectPage({ params }) {
//   const { shortCode } = params;
//   let targetUrl = '/not-found';

//   try {
//     const analyticsResponse = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/click/${shortCode}`,
//       { redirect: 'manual', cache: 'no-store' }
//     );

//     if (analyticsResponse.status === 307) {
//       targetUrl = analyticsResponse.headers.get('Location');
//     }
//   } catch (error) {
//     console.error('Redirect error:', error);
//     targetUrl = '/error';
//   }

//   redirect(targetUrl);
// }