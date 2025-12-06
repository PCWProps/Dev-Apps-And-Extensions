/**
 * Main Cloudflare Worker entry point
 * Routes requests to appropriate handlers
 */

import { handleAuth } from './auth';
import { handleLicense } from './license';
import { handleAnalytics } from './analytics';
import { validateToken } from './validate-token';
import { handleStripeWebhook } from './stripe-webhooks';
import { handleSubscriptionEvent } from './subscription-events';

export interface Env {
  SESSIONS: KVNamespace;
  CACHE: KVNamespace;
  ASSETS: R2Bucket;
  DB: D1Database;
  VECTORIZE: VectorizeIndex;
  TASKS: Queue;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  JWT_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route to appropriate handler
      if (path.startsWith('/auth')) {
        return await handleAuth(request, env);
      } else if (path.startsWith('/license')) {
        return await handleLicense(request, env);
      } else if (path.startsWith('/analytics')) {
        return await handleAnalytics(request, env);
      } else if (path.startsWith('/validate-token')) {
        return await validateToken(request, env);
      } else if (path.startsWith('/webhooks/stripe')) {
        return await handleStripeWebhook(request, env);
      } else if (path.startsWith('/subscription')) {
        return await handleSubscriptionEvent(request, env);
      } else if (path === '/' || path === '/health') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.ENVIRONMENT || 'unknown',
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};
