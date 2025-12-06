/**
 * License management handler
 */

import type { Env } from './index';

interface LicenseValidationRequest {
  licenseKey: string;
  machineId?: string;
}

export async function handleLicense(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/license/validate' && request.method === 'POST') {
    return await validateLicense(request, env);
  } else if (path === '/license/activate' && request.method === 'POST') {
    return await activateLicense(request, env);
  } else if (path === '/license/deactivate' && request.method === 'POST') {
    return await deactivateLicense(request, env);
  } else if (path.startsWith('/license/') && request.method === 'GET') {
    return await getLicenseInfo(request, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function validateLicense(request: Request, env: Env): Promise<Response> {
  try {
    const body: LicenseValidationRequest = await request.json();

    if (!body.licenseKey) {
      return new Response(JSON.stringify({ error: 'License key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Query license from D1
    const license = await env.DB.prepare(
      'SELECT * FROM licenses WHERE license_key = ? AND status = "active"'
    )
      .bind(body.licenseKey)
      .first();

    if (!license) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Invalid or inactive license',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check expiration
    const expiresAt = Number(license.expires_at);
    if (expiresAt < Date.now()) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'License has expired',
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
        license: {
          tier: license.tier,
          expiresAt: new Date(expiresAt).toISOString(),
          features: getFeaturesByTier(license.tier as string),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('License validation error:', error);
    return new Response(
      JSON.stringify({ error: 'Validation failed', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function activateLicense(request: Request, env: Env): Promise<Response> {
  try {
    const body: LicenseValidationRequest = await request.json();

    if (!body.licenseKey || !body.machineId) {
      return new Response(
        JSON.stringify({ error: 'License key and machine ID are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get license
    const license = await env.DB.prepare(
      'SELECT * FROM licenses WHERE license_key = ? AND status = "active"'
    )
      .bind(body.licenseKey)
      .first();

    if (!license) {
      return new Response(
        JSON.stringify({ error: 'Invalid license' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create or update activation
    await env.DB.prepare(
      `INSERT INTO license_activations (id, license_id, machine_id, activated_at, last_seen_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(license_id, machine_id) DO UPDATE SET last_seen_at = ?`
    )
      .bind(
        crypto.randomUUID(),
        license.id,
        body.machineId,
        Date.now(),
        Date.now(),
        Date.now()
      )
      .run();

    return new Response(
      JSON.stringify({
        activated: true,
        message: 'License activated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('License activation error:', error);
    return new Response(
      JSON.stringify({ error: 'Activation failed', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function deactivateLicense(request: Request, env: Env): Promise<Response> {
  try {
    const body: LicenseValidationRequest = await request.json();

    if (!body.licenseKey || !body.machineId) {
      return new Response(
        JSON.stringify({ error: 'License key and machine ID are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get license
    const license = await env.DB.prepare(
      'SELECT id FROM licenses WHERE license_key = ?'
    )
      .bind(body.licenseKey)
      .first();

    if (!license) {
      return new Response(
        JSON.stringify({ error: 'License not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Remove activation
    await env.DB.prepare(
      'DELETE FROM license_activations WHERE license_id = ? AND machine_id = ?'
    )
      .bind(license.id, body.machineId)
      .run();

    return new Response(
      JSON.stringify({
        deactivated: true,
        message: 'License deactivated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Deactivation failed', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function getLicenseInfo(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const licenseKey = url.pathname.split('/').pop();

    if (!licenseKey) {
      return new Response(JSON.stringify({ error: 'License key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const license = await env.DB.prepare(
      'SELECT * FROM licenses WHERE license_key = ?'
    )
      .bind(licenseKey)
      .first();

    if (!license) {
      return new Response(
        JSON.stringify({ error: 'License not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        tier: license.tier,
        status: license.status,
        expiresAt: new Date(Number(license.expires_at)).toISOString(),
        features: getFeaturesByTier(license.tier as string),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get license info', message: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function getFeaturesByTier(tier: string): string[] {
  const features: Record<string, string[]> = {
    basic: ['core-features', 'basic-support'],
    premium: ['core-features', 'basic-support', 'advanced-features', 'priority-support'],
    enterprise: [
      'core-features',
      'basic-support',
      'advanced-features',
      'priority-support',
      'custom-integration',
      'sla',
    ],
  };

  return features[tier] || [];
}
