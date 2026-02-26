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
    // The @vercel/blob SDK looks for BLOB_READ_WRITE_TOKEN in the environment variables automatically.
    // We add an explicit check here to provide a better error message if it's missing.
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('ERROR: BLOB_READ_WRITE_TOKEN is not defined.');
      return response.status(500).json({ error: 'Storage configuration missing' });
    }

    // Store each email as a separate file to avoid concurrent write issues
    // Path: waitlist/<timestamp>-<email>.json
    const filename = `waitlist/${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    
    console.log(`Attempting to upload to Vercel Blob: ${filename}`);

    const blob = await put(filename, JSON.stringify({
      email,
      submittedAt: new Date().toISOString(),
    }), {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log(`Successfully stored email at: ${blob.url}`);

    return response.status(200).json({ 
      message: 'Success',
      url: blob.url 
    });
  } catch (error: any) {
    console.error('Vercel Blob storage error:', error.message || error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
