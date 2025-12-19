#!/usr/bin/env ts-node
import { existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

const REQUIRED_PATHS = [
  'package.json',
  'pnpm-workspace.yaml',
  'turbo.json',
  'tsconfig.base.json',
  'extensions',
  'cloudflare',
  'vercel',
  'website',
  'tools',
  'automation',
  'config',
  'docs',
  'environments',
  'infrastructure',
];

async function validateMonorepoStructure() {
  console.log(chalk.blue('🔍 Validating monorepo structure...'));
  
  const root = process.cwd();
  let hasErrors = false;
  
  for (const path of REQUIRED_PATHS) {
    const fullPath = resolve(root, path);
    const exists = existsSync(fullPath);
    
    if (exists) {
      console.log(chalk.green(`✓ ${path}`));
    } else {
      console.log(chalk.red(`✗ ${path} (missing)`));
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    console.error(chalk.red('\n❌ Monorepo structure validation failed'));
    process.exit(1);
  }
  
  console.log(chalk.green('\n✅ Monorepo structure is valid!'));
  return true;
}

if (require.main === module) {
  validateMonorepoStructure();
}

export { validateMonorepoStructure };
