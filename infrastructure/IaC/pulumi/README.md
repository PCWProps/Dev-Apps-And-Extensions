# Pulumi Infrastructure as Code

This directory contains Pulumi configurations for deploying BearBuddy infrastructure.

## Prerequisites

- Pulumi CLI installed
- Node.js >= 18
- Cloudflare account and API token
- Vercel account and API token

## Setup

### Install Dependencies

```bash
pnpm install
```

### Login to Pulumi

```bash
pulumi login
```

### Configure Stack

Create a new stack or select existing:

```bash
pulumi stack init dev
pulumi config set environment dev
pulumi config set cloudflareAccountId your-account-id
pulumi config set --secret cloudflareApiToken your-token
pulumi config set --secret vercelApiToken your-token
```

## Usage

### Preview Changes

```bash
pulumi preview
```

### Deploy

```bash
pulumi up
```

### Destroy

```bash
pulumi destroy
```

### View Outputs

```bash
pulumi stack output
```

## Stacks

Create separate stacks for each environment:

- `dev` - Development
- `staging` - Staging
- `production` - Production

## Resources

### Cloudflare
- KV Namespaces
- D1 Database
- R2 Bucket
- Worker Script

### Outputs

The following values are exported:

- `workerUrl` - Cloudflare Worker URL
- `sessionsNamespaceId` - KV namespace for sessions
- `cacheNamespaceId` - KV namespace for cache
- `databaseId` - D1 database ID
- `bucketName` - R2 bucket name

## vs Terraform

Pulumi advantages:
- TypeScript-based (familiar for JS/TS developers)
- Better IDE support
- More flexible programming constructs

Choose based on team preference and existing tooling.
