# CI/CD Workflows

## 🔄 Overview

This document describes the CI/CD pipelines for the monorepo using GitHub Actions.

## 🏗️ Workflow Structure

```
.github/workflows/
├── ci.yml                 # Main CI pipeline
├── deploy-extensions.yml  # Extension publishing
├── deploy-cloudflare.yml  # Cloudflare Workers
├── deploy-vercel.yml      # Vercel deployment
├── deploy-website.yml     # GitHub Pages
└── release.yml            # Release automation
```

## ✅ CI Pipeline (ci.yml)

### Triggers

- Push to `main`, `develop`
- Pull requests to `main`, `develop`
- Manual dispatch

### Jobs

```yaml
jobs:
  lint:
    - Run ESLint
    - Run Prettier check
    - Check TypeScript

  build:
    - Install dependencies (pnpm)
    - Build all packages (Turbo)
    - Cache build artifacts

  test:
    - Run unit tests
    - Run integration tests
    - Generate coverage report
    - Upload to Codecov

  type-check:
    - TypeScript compilation
    - Check all packages

  validate:
    - Validate package.json files
    - Check dependencies
    - Verify monorepo structure
```

### Example Configuration

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Build
        run: pnpm build
      
      - name: Test
        run: pnpm test
```

## 📦 Extension Deployment (deploy-extensions.yml)

### Triggers

- Tag push matching `v*.*.*`
- Manual dispatch

### Jobs

```yaml
jobs:
  package:
    - Build extensions
    - Run tests
    - Package .vsix files
    - Upload artifacts

  publish-marketplace:
    - Download artifacts
    - Publish to VS Code Marketplace
    - Verify publication

  publish-openvsx:
    - Download artifacts
    - Publish to Open VSX
    - Verify publication

  create-release:
    - Create GitHub Release
    - Attach .vsix files
    - Generate release notes
```

### Secrets Required

- `VSCODE_PAT`: VS Code Marketplace token
- `OPEN_VSX_TOKEN`: Open VSX token
- `GITHUB_TOKEN`: (Automatically provided)

## ☁️ Cloudflare Deployment (deploy-cloudflare.yml)

### Triggers

- Push to `main` (production)
- Push to `develop` (staging)
- Manual dispatch

### Jobs

```yaml
jobs:
  deploy-workers:
    - Build Worker code
    - Run tests
    - Deploy to Cloudflare
    - Verify deployment

  migrate-database:
    - Run D1 migrations
    - Seed initial data
    - Verify schema

  update-kv:
    - Update KV configuration
    - Seed initial values

  smoke-test:
    - Test API endpoints
    - Verify authentication
    - Check integrations
```

### Secrets Required

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `STRIPE_SECRET_KEY` (for webhooks)

## ⚡ Vercel Deployment (deploy-vercel.yml)

### Triggers

- Push to `main` (production)
- Push to `develop` (preview)
- Pull requests (preview)

### Jobs

```yaml
jobs:
  deploy:
    - Build edge functions
    - Deploy to Vercel
    - Get deployment URL
    - Comment on PR with URL

  test:
    - Run smoke tests
    - Verify edge functions
    - Check API routes
```

### Secrets Required

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🌐 Website Deployment (deploy-website.yml)

### Triggers

- Push to `main`
- Changes in `website/` directory

### Jobs

```yaml
jobs:
  build:
    - Set up Ruby
    - Install Jekyll
    - Build site
    - Upload artifact

  deploy:
    - Deploy to GitHub Pages
    - Verify deployment
```

## 🚀 Release Workflow (release.yml)

### Triggers

- Manual dispatch with version input

### Jobs

```yaml
jobs:
  prepare-release:
    - Bump version numbers
    - Update CHANGELOG
    - Commit changes

  build-and-test:
    - Run full CI pipeline
    - Generate artifacts

  create-release:
    - Create git tag
    - Create GitHub Release
    - Upload artifacts

  publish:
    - Publish extensions
    - Deploy workers
    - Update website
```

## 🔐 Security Scanning

### CodeQL Analysis

```yaml
jobs:
  codeql:
    - Initialize CodeQL
    - Autobuild
    - Perform analysis
    - Upload results
```

### Dependency Scanning

```yaml
jobs:
  dependency-review:
    - Check for vulnerabilities
    - Review license compliance
    - Alert on issues
```

## 📊 Workflow Status Badges

Add to README.md:

```markdown
![CI](https://github.com/PCWProps/Dev-Apps-And-Extensions/workflows/CI/badge.svg)
![Deploy](https://github.com/PCWProps/Dev-Apps-And-Extensions/workflows/Deploy/badge.svg)
```

## 🎯 Branch Protection Rules

### Main Branch

- Require pull request reviews (2)
- Require status checks to pass:
  - CI / lint
  - CI / build
  - CI / test
  - CI / type-check
- Require linear history
- Include administrators

### Develop Branch

- Require pull request reviews (1)
- Require status checks to pass
- Allow force pushes (maintainers only)

## 🔄 Deployment Strategies

### Blue-Green Deployment

```
Production (v1.2.3)
    ↓
Deploy v1.3.0 to staging
    ↓
Run smoke tests
    ↓
Switch traffic to v1.3.0
    ↓
Monitor for issues
    ↓
Rollback if needed
```

### Canary Deployment

```
Deploy to 10% of users
    ↓
Monitor metrics
    ↓
If stable: Deploy to 50%
    ↓
Monitor metrics
    ↓
If stable: Deploy to 100%
```

## 🚨 Rollback Procedures

### Extension Rollback

```bash
# Revert to previous version
git revert <commit-hash>
git push origin main

# Re-tag and publish
git tag v1.2.3-hotfix
pnpm publish:extensions
```

### Worker Rollback

```bash
# Deploy previous version
cd cloudflare
wrangler rollback --env production
```

### Vercel Rollback

```bash
# Via Vercel Dashboard or CLI
vercel rollback <deployment-url>
```

## 📝 Workflow Best Practices

### Do's

✅ Use caching for dependencies
✅ Parallelize independent jobs
✅ Set appropriate timeouts
✅ Use matrix strategies for multi-version testing
✅ Store secrets securely
✅ Add status badges

### Don'ts

❌ Commit secrets to workflows
❌ Run long tests on every commit
❌ Deploy without testing
❌ Skip smoke tests
❌ Ignore workflow failures

## 🧪 Testing in CI

### Unit Tests

```bash
pnpm test
```

### Integration Tests

```bash
pnpm test:integration
```

### E2E Tests

```bash
pnpm test:e2e
```

## 📈 Monitoring

### Workflow Metrics

- Build time
- Success rate
- Deployment frequency
- Mean time to recovery (MTTR)

### Alerts

- Failed deployments
- Test failures
- Security vulnerabilities
- Dependency updates

## 🔧 Troubleshooting

### Common Issues

**Issue**: pnpm install fails
**Solution**: Clear cache, verify lockfile

**Issue**: Build timeout
**Solution**: Increase timeout, optimize build

**Issue**: Deployment fails
**Solution**: Check secrets, verify permissions

**Issue**: Tests flaky
**Solution**: Add retry logic, fix race conditions

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Turborepo CI/CD](https://turbo.build/repo/docs/ci)
- [Cloudflare Wrangler CI](https://developers.cloudflare.com/workers/wrangler/ci-cd/)
- [Vercel CLI](https://vercel.com/docs/cli)

## 🤝 Contributing

When modifying workflows:
1. Test locally with [act](https://github.com/nektos/act)
2. Create PR with workflow changes
3. Monitor first run carefully
4. Update documentation
