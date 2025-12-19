/**
 * Vercel API Route: License Check
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ error: 'License key is required' });
    }

    // Forward to Cloudflare Worker for validation
    const cloudflareUrl = process.env.CLOUDFLARE_WORKER_URL || 'https://api.example.com';
    const response = await fetch(`${cloudflareUrl}/license/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'License validation failed' });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('License check error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
