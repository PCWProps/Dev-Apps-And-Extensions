# Terraform Infrastructure as Code

This directory contains Terraform configurations for deploying BearBuddy infrastructure.

## Prerequisites

- Terraform >= 1.0
- Cloudflare account and API token
- Vercel account and API token
- AWS account for state storage (S3)

## Structure

- `main.tf` - Provider configuration and backend
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `cloudflare.tf` - Cloudflare resources (Workers, KV, D1, R2)
- `vercel.tf` - Vercel project and domains

## Usage

### Initialize

```bash
terraform init
```

### Plan

```bash
terraform plan -var="environment=dev"
```

### Apply

```bash
terraform apply -var="environment=dev"
```

### Destroy

```bash
terraform destroy -var="environment=dev"
```

## Required Variables

Set these via environment variables or `.tfvars` file:

```bash
export TF_VAR_cloudflare_api_token="your-token"
export TF_VAR_cloudflare_account_id="your-account-id"
export TF_VAR_vercel_api_token="your-token"
```

Or create `terraform.tfvars`:

```hcl
cloudflare_api_token  = "your-token"
cloudflare_account_id = "your-account-id"
vercel_api_token      = "your-token"
environment           = "dev"
domain_name           = "bearbuddy.io"
```

## State Management

State is stored in S3. Ensure the bucket exists:

```bash
aws s3 mb s3://bearbuddy-terraform-state
```

## Environments

Deploy to different environments by changing the `environment` variable:

- `dev` - Development environment
- `staging` - Staging environment
- `production` - Production environment

## Resources Created

### Cloudflare
- KV Namespaces (sessions, cache)
- D1 Database
- R2 Bucket
- Worker Script
- Worker Route

### Vercel
- Project
- Domain

## Security

- Never commit API tokens
- Use 1Password or AWS Secrets Manager for secrets
- Restrict Terraform state bucket access
- Use least-privilege IAM policies
