import { createLogger } from '@repo/logger';

const logger = createLogger({ prefix: 'shared-utils' });

/**
 * Delay execution for specified milliseconds
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { retries = 3, delay: initialDelay = 1000, backoff = 2 } = options;
  
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${attempt}/${retries} failed: ${lastError.message}`);
      
      if (attempt < retries) {
        const waitTime = initialDelay * Math.pow(backoff, attempt - 1);
        logger.info(`Retrying in ${waitTime}ms...`);
        await delay(waitTime);
      }
    }
  }
  
  throw lastError || new Error('Retry failed');
}

/**
 * Parse JSON safely
 */
export function parseJSON<T = any>(json: string, fallback?: T): T | null {
  try {
    return JSON.parse(json);
  } catch (error) {
    logger.warn('Failed to parse JSON:', error);
    return fallback ?? null;
  }
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if code is running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if code is running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export default {
  delay,
  retry,
  parseJSON,
  generateId,
  isProduction,
  isDevelopment,
};
