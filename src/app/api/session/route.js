//api/session/route.js

import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    const sessionId = uuidv4();
    return new Response(JSON.stringify({ sessionId }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create session' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}