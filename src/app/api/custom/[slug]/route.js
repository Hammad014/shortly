import dbConnect from '../../../lib/db';
import Link from '../../../models/Link';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { slug } = params;
  const host = req.headers.get('host');

  try {
    await dbConnect();
    
    // Find link by custom domain and slug
    const link = await Link.findOne({
      domain: host,
      $or: [{ shortUrl: slug }, { customAlias: slug }]
    });

    if (!link) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }

    // Update analytics (same as existing click tracking)
    const ip = req.headers.get('x-forwarded-for') || req.ip;
    const userAgent = req.headers.get('user-agent');
    
    await Link.findByIdAndUpdate(link._id, {
      $inc: { totalClicks: 1 },
      $push: {
        clicks: {
          ip,
          userAgent,
          timestamp: new Date()
        }
      }
    });

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Custom domain redirect error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
}