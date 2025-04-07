//api/links/route.js

import dbConnect from '../../lib/db';
import Link from '../../models/Link';

// Example utility function (adjust as needed)
function generateShortCode(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash).toString(36);
}

async function validateSession(sessionId) {
  if (!sessionId) {
    return { valid: false, error: 'Missing session ID' };
  }
  
  // Add any additional session validation logic here
  return { valid: true };
}

// Handle POST requests (e.g., shorten a URL)
export async function POST(req) {
  await dbConnect();
  const { originalUrl, sessionId, customAlias } = await req.json();

  const sessionValidation = await validateSession(sessionId);
  if (!sessionValidation.valid) {
    return new Response(JSON.stringify({ error: sessionValidation.error }), { 
      status: 401 
    });
  }
  // Validate input
  if (!originalUrl || !sessionId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    let shortCode = customAlias;
    let aliasValidation = true;

    if (customAlias) {
      // Validate custom alias format
      if (!/^[a-z0-9_-]{3,20}$/.test(customAlias)) {
        return new Response(
          JSON.stringify({ error: 'Invalid alias format' }), 
          { status: 400 }
        );
      }

      // Check if alias exists
      const existing = await Link.findOne({ 
        $or: [{ shortUrl: customAlias }, { customAlias }]
      });
      
      if (existing) {
        return new Response(
          JSON.stringify({ error: 'Alias already in use' }), 
          { status: 409 }
        );
      }
    } else {
      // Generate random short code
      shortCode = generateShortCode(originalUrl);
    }

    const fullShortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;

    const link = new Link({
      originalUrl,
      shortUrl: shortCode,
      fullShortUrl,
      customAlias: customAlias || undefined,
      sessionId,
      status: 'active',
      source: 'single'
    });

    await link.save();

    return new Response(JSON.stringify({ 
      shortUrl: fullShortUrl,
      customAlias: customAlias || null
    }), { status: 200 });

  } catch (error) {
    console.error('Error shortening link:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}

// Handle GET requests (e.g., fetch links for a session)
// api/links/route.js (updated GET handler)
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const showBulk = searchParams.get('showBulk') === 'true'; // Add this line

  const sessionValidation = await validateSession(sessionId);
  if (!sessionValidation.valid) {
    return new Response(JSON.stringify({ error: sessionValidation.error }), { 
      status: 401 
    });
  }

  try {
    const query = { sessionId };
    if (!showBulk) {
      query.source = { $ne: 'bulk' };
    }

    const links = await Link.find(query).sort({ date: -1 });
    return new Response(JSON.stringify(links), { status: 200 });
  } catch (error) {
    console.error('Error fetching links:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


// Add this to api/links/route.js
export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const sessionId = searchParams.get('sessionId');

  // Handle bulk delete
  if (req.headers.get('content-type') === 'application/json') {
    const { ids } = await req.json();
    try {
      await Link.deleteMany({ 
        _id: { $in: ids },
        sessionId 
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error('Bulk delete error:', error);
      return new Response(JSON.stringify({ error: 'Bulk delete failed' }), { status: 500 });
    }
  }

  // Existing single delete logic
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Session ID required' }), { status: 400 });
  }

  try {
    const deletedLink = await Link.findOneAndDelete({
      _id: id,
      sessionId: sessionId
    });

    if (deletedLink) {
      return new Response(JSON.stringify({ message: 'Link deleted successfully' }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Link not found' }), { status: 404 });
  } catch (error) {
    console.error('Error deleting link:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


export async function PUT(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const sessionId = searchParams.get('sessionId');
  const { customAlias } = await req.json();

  if (!id || !sessionId) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  try {
    // Validate alias format
    if (!/^[a-z0-9_-]{3,20}$/.test(customAlias)) {
      return new Response(
        JSON.stringify({ error: 'Invalid alias format' }), 
        { status: 400 }
      );
    }

    // Check alias availability
    const existing = await Link.findOne({ 
      $or: [{ shortUrl: customAlias }, { customAlias }],
      _id: { $ne: id } // Exclude current link
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Alias already in use' }), 
        { status: 409 }
      );
    }

    // Update the link
    const updatedLink = await Link.findOneAndUpdate(
      { _id: id, sessionId },
      { customAlias, shortUrl: customAlias },
      { new: true }
    );

    if (!updatedLink) {
      return new Response(JSON.stringify({ error: 'Link not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedLink), { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}


// api/links/route.js (updated PATCH handler)
export async function PATCH(req) {
  await dbConnect();
  const { id, expirationType, expiresAt, expireAfterClicks } = await req.json();

  try {
    // Validate inputs
    if (expirationType === 'datetime') {
      const expirationDate = new Date(expiresAt);
      if (expirationDate < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Expiration date must be in the future' }), 
          { status: 400 }
        );
      }
    }

    if (expirationType === 'clicks' && expireAfterClicks < 1) {
      return new Response(
        JSON.stringify({ error: 'Click limit must be at least 1' }), 
        { status: 400 }
      );
    }

    const updateData = {
      expirationType,
      expiresAt: expirationType === 'datetime' ? new Date(expiresAt) : null,
      expireAfterClicks: expirationType === 'clicks' ? expireAfterClicks : null,
      status: 'active' // Reset status when updating
    };

    // Automatically expire if needed
    if (expirationType === 'datetime' && new Date(expiresAt) < new Date()) {
      updateData.status = 'expired';
    }

    const updatedLink = await Link.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Check clicks expiration
    if (expirationType === 'clicks' && updatedLink.totalClicks >= updatedLink.expireAfterClicks) {
      await Link.findByIdAndUpdate(id, { status: 'expired' });
      updatedLink.status = 'expired';
    }

    return new Response(JSON.stringify(updatedLink), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating expiration:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}