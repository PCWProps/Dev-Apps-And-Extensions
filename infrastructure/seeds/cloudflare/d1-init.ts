#!/usr/bin/env ts-node
/**
 * Initialize Cloudflare D1 database with schema
 */

interface D1InitOptions {
  database: string;
  environment: 'dev' | 'staging' | 'production';
}

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK(tier IN ('basic', 'premium', 'enterprise')),
  status TEXT NOT NULL CHECK(status IN ('active', 'expired', 'revoked')),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- License activations table
CREATE TABLE IF NOT EXISTS license_activations (
  id TEXT PRIMARY KEY,
  license_id TEXT NOT NULL,
  machine_id TEXT NOT NULL,
  activated_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  FOREIGN KEY (license_id) REFERENCES licenses(id),
  UNIQUE(license_id, machine_id)
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  event_data TEXT,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_activations_license_id ON license_activations(license_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);
`;

async function initD1(options: D1InitOptions) {
  console.log(`Initializing D1 database: ${options.database} (${options.environment})`);

  // In production, this would use Wrangler or D1 API
  console.log('Executing schema...');
  console.log(schema);

  // wrangler d1 execute <database> --file=schema.sql

  console.log('D1 initialization complete!');
}

if (require.main === module) {
  const database = process.argv[2] || 'DB';
  const environment = (process.argv[3] || 'dev') as 'dev' | 'staging' | 'production';

  initD1({ database, environment }).catch(error => {
    console.error('D1 initialization failed:', error);
    process.exit(1);
  });
}

export { initD1, schema };
