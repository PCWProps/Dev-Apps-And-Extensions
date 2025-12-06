/**
 * Vercel Edge Function: Rate Limiting
 */

export const config = { runtime: 'edge' };

interface RateLimitConfig {
  requestsPerMinute: number;
  burstSize: number;
}

const defaultConfig: RateLimitConfig = {
  requestsPerMinute: 60,
  burstSize: 10,
};

export default async function handler(request: Request) {
  const { method } = request;
  const url = new URL(request.url);

  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client identifier (IP or API key)
    const clientId = getClientId(request);
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(clientId, defaultConfig);

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(defaultConfig.requestsPerMinute),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetAt),
            ...corsHeaders,
          },
        }
      );
    }

    // Rate limit passed
    return new Response(
      JSON.stringify({
        allowed: true,
        limit: defaultConfig.requestsPerMinute,
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(defaultConfig.requestsPerMinute),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetAt),
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Rate limit error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
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
}

function getClientId(request: Request): string {
  // Try to get from API key header first
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey) {
    return `api:${apiKey}`;
  }

  // Fall back to IP address
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return `ip:${ip}`;
}

async function checkRateLimit(
  clientId: string,
  config: RateLimitConfig
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}> {
  // In production, this would use Vercel KV or Cloudflare KV for distributed rate limiting
  // For now, return a mock response that allows the request
  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + 60; // Reset in 60 seconds

  // Mock: always allow for now
  return {
    allowed: true,
    remaining: config.requestsPerMinute - 1,
    resetAt,
  };
}
