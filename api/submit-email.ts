import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel Serverless Function entry point
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      return res.status(500).json({ 
        error: 'Missing Token', 
        message: 'BLOB_READ_WRITE_TOKEN is not set in environment variables.' 
      });
    }

    // Attempt to store in Vercel Blob
    const filename = `waitlist/${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    
    // We use a simple JSON string as the content
    const content = JSON.stringify({
      email,
      timestamp: new Date().toISOString(),
    });

    const blob = await put(filename, content, {
      access: 'public', // Changed back to public for easier initial testing
      token: token,
      contentType: 'application/json',
    });

    return res.status(200).json({ 
      success: true, 
      url: blob.url 
    });

  } catch (error: any) {
    console.error('Submit email error:', error);
    
    // Return the actual error message to the client for debugging
    return res.status(500).json({ 
      error: 'Exception Occurred',
      message: error.message,
      stack: error.stack?.split('\n')[0], // Just the first line of the stack
      token_check: !!process.env.BLOB_READ_WRITE_TOKEN
    });
  }
}
