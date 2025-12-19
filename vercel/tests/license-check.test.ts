import { describe, it, expect } from 'vitest';
import handler from '../api/license-check';

describe('Vercel License Check API', () => {
  it('should reject requests without license key', async () => {
    const request = new Request('https://api.example.com/api/license-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBeTruthy();
  });

  it('should forward valid requests to Cloudflare', async () => {
    const request = new Request('https://api.example.com/api/license-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: 'TEST-TEST-TEST-TEST',
      }),
    });

    const response = await handler(request);
    expect(response).toBeTruthy();
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  });

  it('should handle malformed requests', async () => {
    const request = new Request('https://api.example.com/api/license-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    });

    const response = await handler(request);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
