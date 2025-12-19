/**
 * Subscription events handler
 */

import type { Env } from './index';

export async function handleSubscriptionEvent(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/subscription/status' && request.method === 'GET') {
    return await getSubscriptionStatus(request, env);
  } else if (path === '/subscription/upgrade' && request.method === 'POST') {
    return await upgradeSubscription(request, env);
  } else if (path === '/subscription/cancel' && request.method === 'POST') {
    return await cancelSubscription(request, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function getSubscriptionStatus(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user's license
    const license = await env.DB.prepare(
      `SELECT * FROM licenses 
       WHERE user_id = ? AND status = 'active' 
       ORDER BY expires_at DESC 
       LIMIT 1`
    )
      .bind(userId)
      .first();

    if (!license) {
      return new Response(
        JSON.stringify({
          status: 'inactive',
          message: 'No active subscription found',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const expiresAt = Number(license.expires_at);
    const daysUntilExpiry = Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

    return new Response(
      JSON.stringify({
        status: 'active',
        tier: license.tier,
        expiresAt: new Date(expiresAt).toISOString(),
        daysUntilExpiry,
        autoRenew: true, // This would come from Stripe subscription
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get subscription status', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function upgradeSubscription(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { userId: string; tier: string };

    if (!body.userId || !body.tier) {
      return new Response(
        JSON.stringify({ error: 'User ID and tier are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update license tier
    await env.DB.prepare(
      `UPDATE licenses 
       SET tier = ?, updated_at = ? 
       WHERE user_id = ? AND status = 'active'`
    )
      .bind(body.tier, Date.now(), body.userId)
      .run();

    // In production, this would also update Stripe subscription
    // const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    // await stripe.subscriptions.update(subscriptionId, { items: [...] });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription upgraded successfully',
        newTier: body.tier,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upgrade subscription', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function cancelSubscription(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { userId: string; immediately?: boolean };

    if (!body.userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body.immediately) {
      // Cancel immediately
      await env.DB.prepare(
        `UPDATE licenses 
         SET status = 'revoked', updated_at = ? 
         WHERE user_id = ? AND status = 'active'`
      )
        .bind(Date.now(), body.userId)
        .run();
    } else {
      // Cancel at end of period (just mark for non-renewal)
      // In production, update Stripe subscription to cancel at period end
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: body.immediately
          ? 'Subscription cancelled immediately'
          : 'Subscription will cancel at end of period',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to cancel subscription', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
