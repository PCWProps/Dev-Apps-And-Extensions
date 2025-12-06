/**
 * Vercel Edge Function: Authentication Middleware
 */

export const config = { runtime: 'edge' };

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
    // Get authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'No valid authorization token provided',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const token = authHeader.substring(7);

    // Validate token with Cloudflare Worker
    const cloudflareUrl = process.env.CLOUDFLARE_WORKER_URL || 'https://api.example.com';
    const validationResponse = await fetch(`${cloudflareUrl}/validate-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!validationResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid token',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const validationData = await validationResponse.json();

    if (!validationData.valid) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: validationData.error || 'Token validation failed',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Token is valid, return user info
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          userId: validationData.userId,
          email: validationData.email,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Auth edge function error:', error);
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
