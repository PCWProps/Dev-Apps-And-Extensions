import { describe, it, expect, beforeEach } from 'vitest';
import { handleLicense } from '../src/license';

describe('License Management', () => {
  let env: any;

  beforeEach(() => {
    env = {
      DB: {
        prepare: () => ({
          bind: () => ({
            first: async () => null,
            all: async () => ({ results: [] }),
            run: async () => ({ success: true }),
          }),
        }),
      },
      CACHE: {
        get: async () => null,
        put: async () => {},
      },
    };
  });

  it('should validate active license key', async () => {
    const request = new Request('https://api.example.com/license/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: 'XXXX-XXXX-XXXX-XXXX',
      }),
    });

    const response = await handleLicense(request, env);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('valid');
    expect(data).toHaveProperty('tier');
  });

  it('should reject invalid license key format', async () => {
    const request = new Request('https://api.example.com/license/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: 'INVALID',
      }),
    });

    const response = await handleLicense(request, env);
    expect(response.status).toBe(400);
  });

  it('should create new license', async () => {
    const request = new Request('https://api.example.com/license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        tier: 'premium',
      }),
    });

    const response = await handleLicense(request, env);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('licenseKey');
    expect(data.tier).toBe('premium');
  });
});
