import { createLogger } from '@repo/logger';

const logger = createLogger({ prefix: 'licensing' });

export interface License {
  key: string;
  email: string;
  tier: 'basic' | 'premium' | 'enterprise';
  expiresAt: Date;
  features: string[];
}

export interface LicenseValidationResult {
  valid: boolean;
  license?: License;
  error?: string;
}

/**
 * Validate license key format
 */
export function isValidLicenseKey(key: string): boolean {
  // Format: XXXX-XXXX-XXXX-XXXX (16 chars + 3 dashes = 19 chars)
  const licenseRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return licenseRegex.test(key);
}

/**
 * Validate license with backend API
 */
export async function validateLicense(
  licenseKey: string,
  apiEndpoint: string
): Promise<LicenseValidationResult> {
  if (!isValidLicenseKey(licenseKey)) {
    return {
      valid: false,
      error: 'Invalid license key format',
    };
  }

  try {
    const response = await fetch(`${apiEndpoint}/license/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey }),
    });

    if (!response.ok) {
      logger.warn(`License validation failed: ${response.statusText}`);
      return {
        valid: false,
        error: 'License validation failed',
      };
    }

    const data = await response.json();

    const license: License = {
      key: licenseKey,
      email: data.email,
      tier: data.tier,
      expiresAt: new Date(data.expiresAt),
      features: data.features || [],
    };

    // Check expiration
    if (license.expiresAt < new Date()) {
      return {
        valid: false,
        error: 'License has expired',
      };
    }

    return {
      valid: true,
      license,
    };
  } catch (error) {
    logger.error('License validation error:', error);
    return {
      valid: false,
      error: 'Failed to validate license',
    };
  }
}

/**
 * Check if license has specific feature
 */
export function hasFeature(license: License, feature: string): boolean {
  return license.features.includes(feature);
}

/**
 * Get tier-based features
 */
export function getTierFeatures(tier: License['tier']): string[] {
  const features = {
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

/**
 * Check if license will expire soon (within 7 days)
 */
export function isExpiringSoon(license: License): boolean {
  const daysUntilExpiry =
    (license.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
}

export default {
  isValidLicenseKey,
  validateLicense,
  hasFeature,
  getTierFeatures,
  isExpiringSoon,
};
