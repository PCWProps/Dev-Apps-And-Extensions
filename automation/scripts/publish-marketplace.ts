#!/usr/bin/env ts-node
import { execaCommand } from 'execa';
import { resolve } from 'path';
import chalk from 'chalk';

interface PublishOptions {
  extensionPath: string;
  token?: string;
}

async function publishToMarketplace(options: PublishOptions) {
  console.log(chalk.blue('📦 Publishing to VS Code Marketplace...'));
  
  const { extensionPath, token } = options;
  const absPath = resolve(process.cwd(), extensionPath);
  
  if (!token && !process.env.VSCODE_PAT) {
    console.error(chalk.red('❌ VSCODE_PAT environment variable is required'));
    process.exit(1);
  }
  
  const publishToken = token || process.env.VSCODE_PAT;
  
  try {
    await execaCommand(`vsce publish -p ${publishToken}`, {
      cwd: absPath,
      stdio: 'inherit',
    });
    
    console.log(chalk.green('✅ Published to VS Code Marketplace successfully!'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Publishing failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  const extensionPath = process.argv[2] || 'extensions/core-extension';
  publishToMarketplace({ extensionPath });
}

export { publishToMarketplace };
