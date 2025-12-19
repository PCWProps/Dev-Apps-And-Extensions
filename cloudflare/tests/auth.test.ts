import { describe, it, expect, beforeEach } from 'vitest';
import { handleAuth } from '../src/auth';

describe('Authentication', () => {
  let env: any;

  beforeEach(() => {
    env = {
      JWT_SECRET: 'test-secret-key',
      SESSIONS: {
        get: async () => null,
        put: async () => {},
      },
    };
  });

  it('should generate JWT token on successful login', async () => {
    const request = new Request('https://api.example.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123',
      }),
    });

    const response = await handleAuth(request, env);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data.token).toBeTruthy();
  });

  it('should reject invalid credentials', async () => {
    const request = new Request('https://api.example.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'invalid',
        password: 'wrong',
      }),
    });

    const response = await handleAuth(request, env);
    expect(response.status).toBe(401);
  });

  it('should validate JWT token', async () => {
    // First login to get token
    const loginRequest = new Request('https://api.example.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123',
      }),
    });

    const loginResponse = await handleAuth(loginRequest, env);
    const { token } = await loginResponse.json();

    // Then validate
    const validateRequest = new Request('https://api.example.com/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const response = await handleAuth(validateRequest, env);
    expect(response.status).toBe(200);
  });
});
