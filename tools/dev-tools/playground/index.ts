/**
 * Development Playground
 * 
 * Use this file to experiment with APIs, test utilities, and debug code.
 * This file is not included in production builds.
 */

import { logger } from '../logger';
import { retry, delay } from '../shared-utils';
import MockAPIServer from './mock-api';

async function main() {
  logger.info('Starting development playground...');

  // Example 1: Test retry utility
  logger.info('Testing retry utility...');
  try {
    await retry(
      async () => {
        logger.debug('Attempting API call...');
        throw new Error('Simulated failure');
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
      }
    );
  } catch (error) {
    logger.error('Retry failed as expected:', error);
  }

  // Example 2: Test delay utility
  logger.info('Testing delay utility...');
  await delay(1000);
  logger.info('Delay completed');

  // Example 3: Start mock API server
  logger.info('Starting mock API server...');
  const mockServer = new MockAPIServer({ port: 3001, delay: 50 });
  mockServer.start();

  // Example 4: Test license validation
  logger.info('Testing license validation...');
  const testLicense = 'ABCD-1234-EFGH-5678';
  logger.debug(`License format valid: ${/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(testLicense)}`);

  // Cleanup
  setTimeout(() => {
    mockServer.stop();
    logger.info('Playground completed');
    process.exit(0);
  }, 5000);
}

// Run playground if executed directly
if (require.main === module) {
  main().catch((error) => {
    logger.error('Playground error:', error);
    process.exit(1);
  });
}

export default main;
