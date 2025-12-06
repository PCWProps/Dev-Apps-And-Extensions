/**
 * Authentication handler
 * Handles JWT token generation and validation
 */

import type { Env } from './index';

interface AuthRequest {
  email: string;
  password?: string;
  provider?: 'email' | 'github' | 'google';
}

interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
}

export async function handleAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/auth/login' && request.method === 'POST') {
    return await handleLogin(request, env);
  } else if (path === '/auth/refresh' && request.method === 'POST') {
    return await handleRefresh(request, env);
  } else if (path === '/auth/logout' && request.method === 'POST') {
    return await handleLogout(request, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body: AuthRequest = await request.json();

    if (!body.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In production, verify credentials against database
    // For now, generate a token
    const userId = crypto.randomUUID();
    const token = await generateToken({ userId, email: body.email }, env);

    // Store session in KV
    await env.SESSIONS.put(`session:${userId}`, JSON.stringify({
      email: body.email,
      createdAt: Date.now(),
    }), {
      expirationTtl: 86400, // 24 hours
    });

    return new Response(
      JSON.stringify({
        token,
        userId,
        email: body.email,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Login failed', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleRefresh(request: Request, env: Env): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, env);

    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate new token
    const newToken = await generateToken(
      { userId: payload.userId, email: payload.email },
      env
    );

    return new Response(
      JSON.stringify({ token: newToken }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Token refresh failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifyToken(token, env);
      
      if (payload) {
        // Remove session from KV
        await env.SESSIONS.delete(`session:${payload.userId}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Logged out successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Logout failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function generateToken(payload: Omit<TokenPayload, 'exp'>, env: Env): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 86400; // 24 hours

  const tokenPayload: TokenPayload = { ...payload, exp };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, env.JWT_SECRET || 'secret');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function verifyToken(token: string, env: Env): Promise<TokenPayload | null> {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    // Verify signature
    const expectedSignature = await sign(
      `${encodedHeader}.${encodedPayload}`,
      env.JWT_SECRET || 'secret'
    );

    if (signature !== expectedSignature) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(atob(encodedPayload));

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
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
