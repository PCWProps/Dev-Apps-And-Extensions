/**
 * Vercel API Route: Telemetry Collection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface TelemetryEvent {
  type: string;
  userId?: string;
  data?: Record<string, any>;
  timestamp?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const events: TelemetryEvent | TelemetryEvent[] = req.body;

    if (!events) {
      return res.status(400).json({ error: 'Events data is required' });
    }

    const eventArray = Array.isArray(events) ? events : [events];

    // Validate events
    for (const event of eventArray) {
      if (!event.type) {
        return res.status(400).json({ error: 'Event type is required' });
      }
    }

    // Forward to Cloudflare Worker for storage
    const cloudflareUrl = process.env.CLOUDFLARE_WORKER_URL || 'https://api.example.com';
    const endpoint = eventArray.length > 1 ? '/analytics/batch' : '/analytics/event';
    
    const response = await fetch(`${cloudflareUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventArray.length > 1 ? eventArray : eventArray[0]),
    });

    if (!response.ok) {
      console.error('Failed to forward telemetry:', await response.text());
      // Don't fail the request - telemetry should be non-blocking
    }

    return res.status(200).json({
      success: true,
      recorded: eventArray.length,
      message: 'Telemetry recorded',
    });
  } catch (error) {
    console.error('Telemetry error:', error);
    // Don't fail the request - telemetry should be non-blocking
    return res.status(200).json({
      success: false,
      error: 'Telemetry recording failed',
    });
  }
}
