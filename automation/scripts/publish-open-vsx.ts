#!/usr/bin/env ts-node
import { execaCommand } from 'execa';
import { resolve } from 'path';
import chalk from 'chalk';

interface PublishOptions {
  extensionPath: string;
  token?: string;
}

async function publishToOpenVSX(options: PublishOptions) {
  console.log(chalk.blue('📦 Publishing to Open VSX...'));
  
  const { extensionPath, token } = options;
  const absPath = resolve(process.cwd(), extensionPath);
  
  if (!token && !process.env.OPEN_VSX_TOKEN) {
    console.error(chalk.red('❌ OPEN_VSX_TOKEN environment variable is required'));
    process.exit(1);
  }
  
  const publishToken = token || process.env.OPEN_VSX_TOKEN;
  
  try {
    await execaCommand(`npx ovsx publish -p ${publishToken}`, {
      cwd: absPath,
      stdio: 'inherit',
    });
    
    console.log(chalk.green('✅ Published to Open VSX successfully!'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Publishing failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  const extensionPath = process.argv[2] || 'extensions/core-extension';
  publishToOpenVSX({ extensionPath });
}

export { publishToOpenVSX };
