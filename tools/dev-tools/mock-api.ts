import { createServer, IncomingMessage, ServerResponse } from 'http';

interface MockAPIOptions {
  port?: number;
  delay?: number;
}

/**
 * Mock API server for local development and testing
 */
export class MockAPIServer {
  private port: number;
  private delay: number;
  private server: any;

  constructor(options: MockAPIOptions = {}) {
    this.port = options.port || 3000;
    this.delay = options.delay || 100;
  }

  /**
   * Start the mock API server
   */
  start(): void {
    this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // Add artificial delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, this.delay));

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      // Route handlers
      if (req.url === '/health') {
        this.handleHealth(req, res);
      } else if (req.url?.startsWith('/api/license')) {
        this.handleLicense(req, res);
      } else if (req.url?.startsWith('/api/auth')) {
        this.handleAuth(req, res);
      } else if (req.url?.startsWith('/api/analytics')) {
        this.handleAnalytics(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    });

    this.server.listen(this.port, () => {
      console.log(`Mock API server running on http://localhost:${this.port}`);
    });
  }

  /**
   * Stop the mock API server
   */
  stop(): void {
    if (this.server) {
      this.server.close(() => {
        console.log('Mock API server stopped');
      });
    }
  }

  private handleHealth(req: IncomingMessage, res: ServerResponse): void {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }));
  }

  private async handleLicense(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const body = await this.readBody(req);

    if (req.url === '/api/license/validate' && req.method === 'POST') {
      const { licenseKey } = JSON.parse(body);

      // Mock validation
      const isValid = licenseKey && licenseKey.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        valid: isValid,
        tier: isValid ? 'premium' : null,
        expiresAt: isValid ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
      }));
    } else if (req.url === '/api/license' && req.method === 'POST') {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        licenseKey: 'MOCK-1234-5678-ABCD',
        tier: 'premium',
        createdAt: new Date().toISOString(),
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }

  private async handleAuth(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const body = await this.readBody(req);

    if (req.url === '/api/auth/login' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600,
      }));
    } else if (req.url === '/api/auth/validate' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        valid: true,
        userId: 'mock-user-id',
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }

  private async handleAnalytics(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method === 'POST') {
      res.writeHead(202, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Event recorded',
      }));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  }

  private readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
      req.on('error', reject);
    });
  }
}

// CLI usage
if (require.main === module) {
  const port = parseInt(process.env.PORT || '3000', 10);
  const delay = parseInt(process.env.DELAY || '100', 10);

  const server = new MockAPIServer({ port, delay });
  server.start();

  process.on('SIGINT', () => {
    server.stop();
    process.exit(0);
  });
}

export default MockAPIServer;
