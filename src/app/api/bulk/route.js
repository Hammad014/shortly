// app/api/bulk/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/db';
import Link from '../../models/Link';
import { generateShortCode } from '../../lib/utils';

export async function POST(req) {
  await dbConnect();
  
  try {
    const { urls, sessionId } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    const results = await Promise.all(urls.map(async (originalUrl) => {
      try {
        // Validate URL format
        let parsedUrl;
        try {
          parsedUrl = new URL(originalUrl);
          if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return { originalUrl, error: 'Invalid URL protocol' };
          }
        } catch {
          return { originalUrl, error: 'Invalid URL format' };
        }

        // Generate short code
        const shortCode = generateShortCode(parsedUrl.href);
        const fullShortUrl = `${baseUrl}/${shortCode}`;

        // Create and save link
        const newLink = new Link({
          originalUrl: parsedUrl.href,
          shortUrl: shortCode,
          fullShortUrl,
          sessionId,
          status: 'active',
          source: 'bulk'
        });

        await newLink.save();

        return {
          originalUrl: parsedUrl.href,
          shortUrl: fullShortUrl,
          status: 'created'
        };
      } catch (error) {
        console.error(`Error processing ${originalUrl}:`, error);
        return {
          originalUrl,
          error: error.message.includes('duplicate') 
            ? 'Short URL already exists' 
            : 'Processing failed'
        };
      }
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Bulk processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}