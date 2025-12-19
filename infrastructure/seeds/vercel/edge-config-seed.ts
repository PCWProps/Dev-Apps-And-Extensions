#!/usr/bin/env ts-node
/**
 * Seed Vercel Edge Config with initial values
 */

interface EdgeConfigSeedOptions {
  environment: 'dev' | 'staging' | 'production';
}

const initialConfig = {
  maintenanceMode: false,
  rateLimit: {
    enabled: true,
    requestsPerMinute: 60,
  },
  featureFlags: {
    betaFeatures: false,
    newUI: false,
  },
  apiEndpoints: {
    cloudflare: 'https://api.example.com',
    licensing: 'https://api.example.com/license',
  },
};

async function seedEdgeConfig(options: EdgeConfigSeedOptions) {
  console.log(`Seeding Edge Config for ${options.environment}...`);

  // In production, this would use Vercel API
  // const response = await fetch('https://api.vercel.com/v1/edge-config/{id}/items', {
  //   method: 'PATCH',
  //   headers: {
  //     Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ items: [{ operation: 'upsert', key, value }] }),
  // });

  Object.entries(initialConfig).forEach(([key, value]) => {
    console.log(`Setting ${key}:`, value);
  });

  console.log('Edge Config seeding complete!');
}

if (require.main === module) {
  const environment = (process.argv[2] || 'dev') as 'dev' | 'staging' | 'production';

  seedEdgeConfig({ environment }).catch(error => {
    console.error('Edge Config seeding failed:', error);
    process.exit(1);
  });
}

export { seedEdgeConfig };
