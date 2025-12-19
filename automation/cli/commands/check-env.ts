import { existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

type Environment = 'dev' | 'staging' | 'prod';

export async function checkEnv(environment: string) {
  console.log(chalk.blue(`🔍 Checking ${environment} environment...`));
  
  if (!['dev', 'staging', 'prod'].includes(environment)) {
    console.error(chalk.red('❌ Invalid environment. Use: dev, staging, or prod'));
    process.exit(1);
  }
  
  const env = environment as Environment;
  const envPath = resolve(process.cwd(), 'environments', env);
  
  const requiredFiles = [
    `cloudflare.${env}.toml`,
    `vercel.${env}.json`,
    `env.${env}.json`,
  ];
  
  let hasErrors = false;
  
  for (const file of requiredFiles) {
    const filePath = resolve(envPath, file);
    const exists = existsSync(filePath);
    
    if (exists) {
      console.log(chalk.green(`✓ ${file}`));
    } else {
      console.log(chalk.red(`✗ ${file} (missing)`));
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    console.error(chalk.red(`\n❌ ${environment} environment is not properly configured`));
    process.exit(1);
  }
  
  console.log(chalk.green(`\n✅ ${environment} environment is properly configured!`));
}
