# Environment Configuration Guide

## 🌍 Overview

This monorepo supports three environments: Development, Staging, and Production. Each environment has isolated resources and configurations.

## 📂 Environment Structure

```
environments/
├── dev/
│   ├── cloudflare.dev.toml
│   ├── vercel.dev.json
│   └── env.dev.json
├── staging/
│   ├── cloudflare.staging.toml
│   ├── vercel.staging.json
│   └── env.staging.json
└── prod/
    ├── cloudflare.prod.toml
    ├── vercel.prod.json
    └── env.prod.json
```

## 🛠️ Development Environment

### Purpose
Local development and testing with real cloud resources.

### Configuration

**Cloudflare (`cloudflare.dev.toml`)**:
- KV namespaces: `dev-*`
- R2 buckets: `dev-*`
- D1 databases: `dev-*`
- Custom domain: `dev.example.com`

**Vercel (`vercel.dev.json`)**:
- Project: `project-dev`
- Environment variables from `.env.dev`
- Preview deployments enabled

**Extension Configuration (`env.dev.json`)**:
```json
{
  "API_BASE_URL": "https://dev.api.example.com",
  "LICENSE_API": "https://dev.license.example.com",
  "ANALYTICS_ENDPOINT": "https://dev.analytics.example.com",
  "FEATURE_FLAGS": {
    "enableBetaFeatures": true,
    "enableDebugMode": true
  }
}
```

### Setup

```bash
# Install dependencies
pnpm install

# Set up Cloudflare dev resources
cd cloudflare
wrangler kv:namespace create "dev-sessions"
wrangler r2 bucket create "dev-assets"
wrangler d1 create "dev-database"

# Initialize database
pnpm run db:migrate:dev

# Set up Vercel
cd ../vercel
vercel link --project=project-dev
vercel env pull .env.dev

# Build for development
cd ..
pnpm build

# Start development servers
pnpm dev
```

### Environment Variables

Create `.env.dev` in root:

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_dev_account_id
CLOUDFLARE_API_TOKEN=your_dev_api_token

# Vercel
VERCEL_TOKEN=your_dev_vercel_token
VERCEL_ORG_ID=your_dev_org_id
VERCEL_PROJECT_ID=your_dev_project_id

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx

# Database
D1_DATABASE_ID=your_dev_d1_id

# KV Namespaces
KV_SESSIONS_ID=your_dev_sessions_kv_id
KV_CACHE_ID=your_dev_cache_kv_id

# R2 Buckets
R2_ASSETS_BUCKET=dev-assets

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_DEBUG_LOGS=true
```

## 🎭 Staging Environment

### Purpose
Pre-production testing with production-like configuration.

### Configuration

**Cloudflare (`cloudflare.staging.toml`)**:
- KV namespaces: `staging-*`
- R2 buckets: `staging-*`
- D1 databases: `staging-*`
- Custom domain: `staging.example.com`

**Vercel (`vercel.staging.json`)**:
- Project: `project-staging`
- Environment variables from `.env.staging`
- Automated deployments from `develop` branch

**Extension Configuration (`env.staging.json`)**:
```json
{
  "API_BASE_URL": "https://staging.api.example.com",
  "LICENSE_API": "https://staging.license.example.com",
  "ANALYTICS_ENDPOINT": "https://staging.analytics.example.com",
  "FEATURE_FLAGS": {
    "enableBetaFeatures": true,
    "enableDebugMode": false
  }
}
```

### Setup

```bash
# Deploy to staging Cloudflare
cd cloudflare
wrangler publish --env staging

# Deploy to staging Vercel
cd ../vercel
vercel --prod --env=staging

# Package extensions for staging
cd ..
pnpm package:extensions
```

### Environment Variables

Create `.env.staging`:

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_staging_account_id
CLOUDFLARE_API_TOKEN=your_staging_api_token

# Vercel
VERCEL_TOKEN=your_staging_vercel_token
VERCEL_ORG_ID=your_staging_org_id
VERCEL_PROJECT_ID=your_staging_project_id

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx

# Database
D1_DATABASE_ID=your_staging_d1_id

# KV Namespaces
KV_SESSIONS_ID=your_staging_sessions_kv_id
KV_CACHE_ID=your_staging_cache_kv_id

# R2 Buckets
R2_ASSETS_BUCKET=staging-assets

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_DEBUG_LOGS=false
```

## 🚀 Production Environment

### Purpose
Live environment serving real users.

### Configuration

**Cloudflare (`cloudflare.prod.toml`)**:
- KV namespaces: `prod-*`
- R2 buckets: `prod-*`
- D1 databases: `prod-*`
- Custom domain: `api.example.com`

**Vercel (`vercel.prod.json`)**:
- Project: `project-prod`
- Environment variables from `.env.prod`
- Automated deployments from `main` branch

**Extension Configuration (`env.prod.json`)**:
```json
{
  "API_BASE_URL": "https://api.example.com",
  "LICENSE_API": "https://license.example.com",
  "ANALYTICS_ENDPOINT": "https://analytics.example.com",
  "FEATURE_FLAGS": {
    "enableBetaFeatures": false,
    "enableDebugMode": false
  }
}
```

### Setup

```bash
# Deploy to production Cloudflare
cd cloudflare
wrangler publish --env production

# Deploy to production Vercel
cd ../vercel
vercel --prod

# Publish extensions
cd ..
pnpm publish:extensions
```

### Environment Variables

Create `.env.prod`:

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_prod_account_id
CLOUDFLARE_API_TOKEN=your_prod_api_token

# Vercel
VERCEL_TOKEN=your_prod_vercel_token
VERCEL_ORG_ID=your_prod_org_id
VERCEL_PROJECT_ID=your_prod_project_id

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_live_xxx

# Database
D1_DATABASE_ID=your_prod_d1_id

# KV Namespaces
KV_SESSIONS_ID=your_prod_sessions_kv_id
KV_CACHE_ID=your_prod_cache_kv_id

# R2 Buckets
R2_ASSETS_BUCKET=prod-assets

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_DEBUG_LOGS=false
```

## 🔐 Secret Management

### Cloudflare Secrets

```bash
# Set secrets per environment
wrangler secret put STRIPE_SECRET_KEY --env dev
wrangler secret put STRIPE_SECRET_KEY --env staging
wrangler secret put STRIPE_SECRET_KEY --env production
```

### Vercel Secrets

```bash
# Set secrets via CLI
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY preview
vercel env add STRIPE_SECRET_KEY development
```

### GitHub Secrets

Add to repository settings:
- `CLOUDFLARE_API_TOKEN`
- `VERCEL_TOKEN`
- `VSCODE_PAT` (for marketplace)
- `OPEN_VSX_TOKEN` (for Open VSX)

## 🔄 Environment Switching

### CLI Helper

```bash
# Switch to development
pnpm cli check-env dev

# Switch to staging
pnpm cli check-env staging

# Switch to production
pnpm cli check-env production
```

### Manual Switching

```bash
# Copy environment config
cp environments/dev/env.dev.json .env.json

# Set environment variable
export NODE_ENV=development
```

## 📊 Environment Comparison

| Feature | Development | Staging | Production |
|---------|------------|---------|------------|
| Debug Logs | ✅ Enabled | ❌ Disabled | ❌ Disabled |
| Beta Features | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| Rate Limiting | ⚡ Relaxed | ✅ Normal | ✅ Strict |
| Analytics | ✅ Enabled | ✅ Enabled | ✅ Enabled |
| Error Reporting | ✅ Verbose | ✅ Normal | ✅ Minimal |
| Stripe Mode | 🧪 Test | 🧪 Test | 💳 Live |

## 🧪 Testing Across Environments

### Local Testing

```bash
# Test against dev environment
NODE_ENV=development pnpm test

# Test against staging environment
NODE_ENV=staging pnpm test
```

### Integration Testing

```bash
# Run integration tests against staging
pnpm test:integration --env=staging
```

### Smoke Testing

```bash
# Quick production smoke test
pnpm test:smoke --env=production
```

## 🚨 Environment Health Checks

### Automated Checks

```bash
# Check all environment health
pnpm cli check-env --all

# Check specific environment
pnpm cli check-env production
```

### Manual Verification

1. API endpoints responding
2. Database connections working
3. KV namespaces accessible
4. R2 buckets available
5. Stripe webhooks configured
6. DNS records correct

## 📝 Environment Best Practices

### Do's

✅ Keep environment configs in version control
✅ Use separate Stripe accounts per environment
✅ Isolate databases completely
✅ Test in staging before production
✅ Rotate secrets regularly
✅ Monitor all environments

### Don'ts

❌ Share secrets between environments
❌ Test against production
❌ Mix environment variables
❌ Skip staging deployments
❌ Commit `.env` files
❌ Use production keys in development

## 🔧 Troubleshooting

### Common Issues

**Issue**: Wrong API endpoint
**Solution**: Check environment variable `API_BASE_URL`

**Issue**: Authentication fails
**Solution**: Verify tokens and secrets are set correctly

**Issue**: Database connection error
**Solution**: Check D1 database ID and permissions

**Issue**: KV namespace not found
**Solution**: Verify namespace bindings in `wrangler.toml`

## 📚 Additional Resources

- [Cloudflare Workers Environments](https://developers.cloudflare.com/workers/wrangler/environments/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [VS Code Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## 🤝 Contributing

When adding environment-specific configuration:
1. Add to all three environments
2. Document in this guide
3. Update setup scripts
4. Add to CI/CD pipelines
