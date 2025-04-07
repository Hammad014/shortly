import { NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  try {
    const { result } = await ogs({
      url,
      downloadLimit: 5000000,
      timeout: 7000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });

    // Fallback to HTML title if no OG tags
    const finalTitle = result.ogTitle || result.twitterTitle || result.dcTitle || result.htmlTitle;
    
    // Fallback description sources
    const finalDescription = result.ogDescription || 
                            result.twitterDescription || 
                            result.dcDescription ||
                            result.htmlMeta?.description;

    // Favicon fallback
    const favicon = result.favicon?.startsWith('http') ? 
                   result.favicon : 
                   `${new URL(url).origin}/favicon.ico`;

    return NextResponse.json({
      success: 1,
      meta: {
        title: finalTitle || new URL(url).hostname,
        description: finalDescription || 'No description available',
        image: {
          url: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url
        },
        siteName: result.ogSiteName || result.twitterSite,
        favicon
      }
    });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json({
      success: 0,
      meta: {
        title: new URL(url).hostname,
        description: 'No description available',
        image: null,
        favicon: `${new URL(url).origin}/favicon.ico`
      }
    });
  }
}