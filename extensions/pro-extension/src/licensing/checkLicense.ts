import * as vscode from 'vscode';
import { validateLicense, License, LicenseValidationResult } from '@repo/shared-utils/licensing';
import { createLogger } from '@repo/logger';

const logger = createLogger({ prefix: 'License' });

export async function checkLicense(): Promise<LicenseValidationResult> {
  const config = vscode.workspace.getConfiguration('bearbuddy-pro');
  const licenseKey = config.get<string>('licenseKey');

  if (!licenseKey) {
    return { valid: false, error: 'No license key found' };
  }

  try {
    const apiEndpoint = process.env.API_BASE_URL || 'https://api.example.com';
    logger.info('Validating license...');
    const result = await validateLicense(licenseKey, apiEndpoint);

    if (result.valid) {
      logger.info('License is valid');
    } else {
      logger.warn('License validation failed:', result.error);
    }

    return result;
  } catch (error) {
    logger.error('License check failed:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export type { License, LicenseValidationResult };
