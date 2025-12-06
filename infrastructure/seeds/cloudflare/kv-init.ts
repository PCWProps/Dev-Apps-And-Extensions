#!/usr/bin/env ts-node
/**
 * Initialize Cloudflare KV namespaces with initial data
 */

interface KVInitOptions {
  namespace: string;
  environment: 'dev' | 'staging' | 'production';
}

const initialData = {
  config: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  },
  featureFlags: {
    betaFeatures: false,
    maintenanceMode: false,
  },
};

async function initKV(options: KVInitOptions) {
  console.log(`Initializing KV namespace: ${options.namespace} (${options.environment})`);

  // In production, this would use Wrangler API or KV REST API
  // For now, this is a template for the initialization logic

  const keys = Object.entries(initialData);

  for (const [key, value] of keys) {
    console.log(`Setting ${key}:`, value);
    // await KV.put(key, JSON.stringify(value));
  }

  console.log('KV initialization complete!');
}

if (require.main === module) {
  const namespace = process.argv[2] || 'SESSIONS';
  const environment = (process.argv[3] || 'dev') as 'dev' | 'staging' | 'production';

  initKV({ namespace, environment }).catch(error => {
    console.error('KV initialization failed:', error);
    process.exit(1);
  });
}

export { initKV };
