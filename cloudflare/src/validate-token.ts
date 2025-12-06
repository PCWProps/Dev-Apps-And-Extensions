/**
 * Token validation endpoint
 */

import type { Env } from './index';

export async function validateToken(request: Request, env: Env): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'No token provided',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.substring(7);

    // Verify token structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Invalid token format',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      const [encodedHeader, encodedPayload, signature] = parts;
      
      // Verify signature
      const expectedSignature = await sign(
        `${encodedHeader}.${encodedPayload}`,
        env.JWT_SECRET || 'secret'
      );

      if (signature !== expectedSignature) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: 'Invalid signature',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const payload = JSON.parse(atob(encodedPayload));

      // Check expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: 'Token expired',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if session exists in KV
      const session = await env.SESSIONS.get(`session:${payload.userId}`);
      if (!session) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: 'Session not found',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          valid: true,
          userId: payload.userId,
          email: payload.email,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Token validation failed',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Validation error', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}
