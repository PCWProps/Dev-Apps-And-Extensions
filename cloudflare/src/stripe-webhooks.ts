/**
 * Stripe webhook handler
 */

import type { Env } from './index';

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
  try {
    // Verify Stripe signature
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'No signature provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.text();
    
    // In production, verify signature with Stripe
    // const event = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
    
    const event: StripeEvent = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutCompleted(event, env);
      
      case 'customer.subscription.created':
        return await handleSubscriptionCreated(event, env);
      
      case 'customer.subscription.updated':
        return await handleSubscriptionUpdated(event, env);
      
      case 'customer.subscription.deleted':
        return await handleSubscriptionDeleted(event, env);
      
      case 'invoice.payment_succeeded':
        return await handlePaymentSucceeded(event, env);
      
      case 'invoice.payment_failed':
        return await handlePaymentFailed(event, env);
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleCheckoutCompleted(event: StripeEvent, env: Env): Promise<Response> {
  const session = event.data.object;
  
  console.log('Checkout completed:', session.id);
  
  // Create user and license
  const userId = crypto.randomUUID();
  const licenseKey = generateLicenseKey();
  
  // Store in D1
  await env.DB.prepare(
    `INSERT INTO users (id, email, created_at, updated_at)
     VALUES (?, ?, ?, ?)`
  )
    .bind(userId, session.customer_email, Date.now(), Date.now())
    .run();
  
  await env.DB.prepare(
    `INSERT INTO licenses (id, user_id, license_key, tier, status, expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      userId,
      licenseKey,
      'premium',
      'active',
      Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      Date.now(),
      Date.now()
    )
    .run();
  
  // Send license key via email (queue for processing)
  await env.TASKS.send({
    type: 'send_license_email',
    email: session.customer_email,
    licenseKey,
  });
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleSubscriptionCreated(event: StripeEvent, env: Env): Promise<Response> {
  const subscription = event.data.object;
  
  console.log('Subscription created:', subscription.id);
  
  // Update license status
  // In production, map subscription to user/license
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleSubscriptionUpdated(event: StripeEvent, env: Env): Promise<Response> {
  const subscription = event.data.object;
  
  console.log('Subscription updated:', subscription.id);
  
  // Update license tier/status based on subscription changes
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleSubscriptionDeleted(event: StripeEvent, env: Env): Promise<Response> {
  const subscription = event.data.object;
  
  console.log('Subscription deleted:', subscription.id);
  
  // Mark license as expired
  // In production, find license by subscription ID and update status
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePaymentSucceeded(event: StripeEvent, env: Env): Promise<Response> {
  const invoice = event.data.object;
  
  console.log('Payment succeeded:', invoice.id);
  
  // Extend license expiration
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePaymentFailed(event: StripeEvent, env: Env): Promise<Response> {
  const invoice = event.data.object;
  
  console.log('Payment failed:', invoice.id);
  
  // Send payment failure notification
  // Update license status if needed
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const parts = [];
  
  for (let i = 0; i < 4; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(part);
  }
  
  return parts.join('-');
}
