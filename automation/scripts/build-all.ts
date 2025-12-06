#!/usr/bin/env ts-node
import { execaCommand } from 'execa';
import chalk from 'chalk';

async function buildAll() {
  console.log(chalk.blue('🏗️  Building all packages...'));
  
  try {
    const { stdout } = await execaCommand('pnpm turbo run build', {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    
    console.log(chalk.green('✅ Build completed successfully!'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  buildAll();
}

export { buildAll };
