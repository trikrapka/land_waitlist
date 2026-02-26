import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    status: 'ok',
    message: 'pong',
    env: {
      has_token: !!process.env.BLOB_READ_WRITE_TOKEN,
      node_version: process.version
    }
  });
}
