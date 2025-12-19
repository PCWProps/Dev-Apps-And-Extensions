/**
 * Vercel API Route: Create Customer Portal Session
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    // In production, create Stripe billing portal session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.billingPortal.sessions.create({
    //   customer: customerId,
    //   return_url: returnUrl || 'https://example.com/account',
    // });

    // For now, return a mock URL
    const mockPortalUrl = `https://billing.stripe.com/session/${crypto.randomUUID()}`;

    return res.status(200).json({
      url: mockPortalUrl,
      customerId,
    });
  } catch (error) {
    console.error('Portal creation error:', error);
    return res.status(500).json({
      error: 'Failed to create portal session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
