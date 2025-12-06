/**
 * Analytics handler
 */

import type { Env } from './index';

interface AnalyticsEvent {
  userId?: string;
  eventType: string;
  eventData?: Record<string, any>;
  timestamp?: number;
}

export async function handleAnalytics(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/analytics/event' && request.method === 'POST') {
    return await recordEvent(request, env);
  } else if (path === '/analytics/batch' && request.method === 'POST') {
    return await recordBatchEvents(request, env);
  } else if (path.startsWith('/analytics/user/') && request.method === 'GET') {
    return await getUserAnalytics(request, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function recordEvent(request: Request, env: Env): Promise<Response> {
  try {
    const event: AnalyticsEvent = await request.json();

    if (!event.eventType) {
      return new Response(JSON.stringify({ error: 'Event type is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const eventId = crypto.randomUUID();
    const timestamp = event.timestamp || Date.now();

    // Store in D1
    await env.DB.prepare(
      `INSERT INTO analytics_events (id, user_id, event_type, event_data, timestamp)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(
        eventId,
        event.userId || null,
        event.eventType,
        event.eventData ? JSON.stringify(event.eventData) : null,
        timestamp
      )
      .run();

    // Also cache aggregated data in KV for quick access
    const cacheKey = `analytics:${event.eventType}:${new Date(timestamp).toISOString().split('T')[0]}`;
    const cached = await env.CACHE.get(cacheKey);
    const count = cached ? parseInt(cached) + 1 : 1;
    await env.CACHE.put(cacheKey, count.toString(), {
      expirationTtl: 86400 * 7, // 7 days
    });

    return new Response(
      JSON.stringify({
        success: true,
        eventId,
        message: 'Event recorded',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to record event', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function recordBatchEvents(request: Request, env: Env): Promise<Response> {
  try {
    const events: AnalyticsEvent[] = await request.json();

    if (!Array.isArray(events) || events.length === 0) {
      return new Response(JSON.stringify({ error: 'Events array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Record each event
    const results = await Promise.all(
      events.map(async event => {
        const eventId = crypto.randomUUID();
        const timestamp = event.timestamp || Date.now();

        try {
          await env.DB.prepare(
            `INSERT INTO analytics_events (id, user_id, event_type, event_data, timestamp)
             VALUES (?, ?, ?, ?, ?)`
          )
            .bind(
              eventId,
              event.userId || null,
              event.eventType,
              event.eventData ? JSON.stringify(event.eventData) : null,
              timestamp
            )
            .run();

          return { eventId, success: true };
        } catch (error) {
          return { eventId, success: false, error: String(error) };
        }
      })
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        recorded: successful,
        failed,
        results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to record batch events', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function getUserAnalytics(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const events = await env.DB.prepare(
      `SELECT * FROM analytics_events 
       WHERE user_id = ? 
       ORDER BY timestamp DESC 
       LIMIT ? OFFSET ?`
    )
      .bind(userId, limit, offset)
      .all();

    return new Response(
      JSON.stringify({
        userId,
        events: events.results,
        count: events.results.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get user analytics', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
