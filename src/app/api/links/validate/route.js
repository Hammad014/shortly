//api/links/validate/route.js

import dbConnect from '../../../lib/db';
import Link from '../../../models/Link';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const alias = searchParams.get('alias');

  if (!alias) {
    return Response.json({ error: 'Alias required' }, { status: 400 });
  }

  try {
    // Check format first
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(alias)) { // Allow uppercase in validation
        return Response.json({
          valid: false,
          available: false,
          message: 'Invalid format (3-20 a-z, 0-9, _, -)'
        });
      }
      

    // Check database
    const exists = await Link.findOne({ 
      $or: [{ shortUrl: alias }, { customAlias: alias }]
    });
    
    return Response.json({ 
      valid: !exists,
      available: !exists,
      message: exists ? 'Alias unavailable' : 'Available'
    });
  } catch (error) {
    return Response.json({ error: 'Validation failed' }, { status: 500 });
  }
}