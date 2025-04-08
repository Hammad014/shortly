// //[shortcode]/page.js


import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
  redirect(`/preview/${params.shortCode}`);
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