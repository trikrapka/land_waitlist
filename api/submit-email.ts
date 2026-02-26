import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = request.body;

  if (!email || !email.includes('@')) {
    return response.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Store each email as a separate file to avoid concurrent write issues
    // Path: waitlist/<timestamp>-<email>.json
    const filename = `waitlist/${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    
    const blob = await put(filename, JSON.stringify({
      email,
      submittedAt: new Date().toISOString(),
    }), {
      access: 'public',
      addRandomSuffix: false, // We use timestamp for uniqueness
    });

    return response.status(200).json({ 
      message: 'Success',
      url: blob.url 
    });
  } catch (error) {
    console.error('Blob storage error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
