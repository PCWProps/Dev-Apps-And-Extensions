#!/usr/bin/env ts-node
import { execaCommand } from 'execa';
import chalk from 'chalk';

async function testAll() {
  console.log(chalk.blue('🧪 Running all tests...'));
  
  try {
    await execaCommand('pnpm turbo run test', {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    
    console.log(chalk.green('✅ All tests passed!'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Tests failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  testAll();
}

export { testAll };
