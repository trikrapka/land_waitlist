import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // 1. Handle Preflight/CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 2. Validate Method
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // 3. Validate Payload
  const { email } = request.body || {};
  if (!email || !email.includes('@')) {
    return response.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // 4. Token Check
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('CRITICAL: BLOB_READ_WRITE_TOKEN is not defined in environment variables.');
      return response.status(500).json({ 
        error: 'Missing Configuration', 
        details: 'BLOB_READ_WRITE_TOKEN is not set on the server.' 
      });
    }

    // 5. Generate Filename
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `waitlist/${Date.now()}-${sanitizedEmail}.json`;
    
    console.log(`Attempting to upload to Vercel Blob: ${filename}`);

    // 6. Perform Upload
    const blob = await put(filename, JSON.stringify({
      email,
      submittedAt: new Date().toISOString(),
    }), {
      access: 'private', // Match user example preference
      token: token,      // Explicitly pass token for robustness
      addRandomSuffix: false,
    });

    console.log(`Successfully stored email at: ${blob.url}`);

    return response.status(200).json({ 
      message: 'Success',
      url: blob.url 
    });
  } catch (error: any) {
    console.error('Vercel Blob storage error:', error.message || error);
    
    // Deliver more useful error details for debugging
    return response.status(500).json({ 
      error: 'Vercel Blob Error',
      message: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}
