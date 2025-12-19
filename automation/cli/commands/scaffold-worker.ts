import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface WorkerOptions {
  name?: string;
}

export async function scaffoldWorker(options: WorkerOptions) {
  console.log(chalk.blue('☁️  Scaffolding new Cloudflare Worker...'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Worker name:',
      default: options.name || 'my-worker',
      validate: (input: string) => input.length > 0 || 'Name is required',
    },
  ]);
  
  const workerPath = resolve(process.cwd(), 'cloudflare', 'src', `${answers.name}.ts`);
  
  try {
    const workerCode = `export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    return new Response('Hello from ${answers.name}!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
`;
    
    await writeFile(workerPath, workerCode);
    
    console.log(chalk.green(`✅ Worker scaffolded at ${workerPath}`));
    console.log(chalk.yellow('\nNext steps:'));
    console.log('  1. Add route to wrangler.toml');
    console.log('  2. Deploy with: cd cloudflare && wrangler publish');
  } catch (error) {
    console.error(chalk.red('❌ Failed to scaffold worker:'), error);
    process.exit(1);
  }
}
