// api/click/[slug]/route.js
import dbConnect from '../../../lib/db';
import Link from '../../../models/Link';
import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    await dbConnect();

    // 1. Find the link first to check expiration status
    const link = await Link.findOne({ shortUrl: slug });
    
    if (!link) {
      return new Response(JSON.stringify({ error: 'Link not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Check expiration status before tracking click
    const isExpired = link.status === 'expired' || 
                     (link.expirationType === 'datetime' && new Date(link.expiresAt) < new Date()) ||
                     (link.expirationType === 'clicks' && link.totalClicks >= link.expireAfterClicks);

    if (isExpired) {
      return new Response(JSON.stringify({ error: 'Link expired' }), { 
        status: 410,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Get client information
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.socket.remoteAddress;
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Parse UA
    const parser = new UAParser(userAgent);
    const { device } = parser.getResult();
    const deviceType = device.type || 
                     (device.vendor === 'Apple' ? 'mobile' : 'desktop');

    // GeoIP handling
    let countryCode = 'Unknown';
    if (!['::1', '127.0.0.1'].includes(ip)) {
      try {
        const geoResponse = await fetch(
          `https://ipinfo.io/${ip}/country?token=0e68ea79bbe621`
        );
        countryCode = geoResponse.ok ? (await geoResponse.text()).trim() : 'Unknown';
      } catch (error) {
        console.error('GeoIP error:', error);
      }
    }

    // Visitor tracking hash
    const visitorHash = crypto.createHash('sha256')
      .update(`${ip}${userAgent}`)
      .digest('hex');

    // 4. Update link analytics
    const updatedLink = await Link.findOneAndUpdate(
      { shortUrl: slug },
      {
        $inc: { totalClicks: 1 },
        $addToSet: { uniqueVisitors: visitorHash },
        $push: {
          clicks: {
            ip,
            userAgent,
            countryCode,
            deviceType,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    // 5. Check for click-based expiration after update
    if (updatedLink.expirationType === 'clicks' && 
        updatedLink.expireAfterClicks && 
        updatedLink.totalClicks >= updatedLink.expireAfterClicks) {
      await Link.findByIdAndUpdate(updatedLink._id, { status: 'expired' });
    }

    return new Response(JSON.stringify({
      redirectTo: updatedLink.originalUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Remove Location header
      }
    });

    // return new Response(JSON.stringify({
    //   redirectTo: updatedLink.originalUrl
    // }), {
    //   status: 307,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Location': updatedLink.originalUrl
    //   }
    // });

  } catch (error) {
    console.error('Click tracking error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}