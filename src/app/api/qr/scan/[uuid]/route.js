// app/api/qr/scan/[uuid]/route.js
import dbConnect from '../../../../lib/db';
import QR from '../../../../models/QR';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { uuid } = params;
  
  try {
    await dbConnect();
    
    // Find QR code
    const qr = await QR.findOne({ uuid });
    if (!qr) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }

    // Check expiration
    if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL('/expired', req.url));
    }

    // Track scan
    await QR.updateOne(
      { _id: qr._id },
      { $inc: { scans: 1 } }
    );

    // Redirect to original URL
    return NextResponse.redirect(qr.url);
    
  } catch (error) {
    console.error('QR Scan Error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
}