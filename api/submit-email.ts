import { sql } from '@vercel/postgres';
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
    // Create table if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS waitlist ( email TEXT UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`;
    
    // Insert email
    await sql`INSERT INTO waitlist (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING;`;
    
    return response.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Database error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
