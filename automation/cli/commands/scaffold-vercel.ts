import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface VercelOptions {
  name?: string;
  type?: 'edge' | 'api';
}

export async function scaffoldVercel(options: VercelOptions) {
  console.log(chalk.blue('⚡ Scaffolding new Vercel function...'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Function name:',
      default: options.name || 'my-function',
      validate: (input: string) => input.length > 0 || 'Name is required',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Function type:',
      choices: ['edge', 'api'],
      default: options.type || 'api',
    },
  ]);
  
  const functionPath = resolve(
    process.cwd(),
    'vercel',
    answers.type,
    `${answers.name}.ts`
  );
  
  try {
    const functionCode = answers.type === 'edge'
      ? `export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  return new Response('Hello from ${answers.name} Edge Function!', {
    headers: { 'Content-Type': 'text/plain' },
  });
}
`
      : `import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ message: 'Hello from ${answers.name} API!' });
}
`;
    
    await mkdir(resolve(process.cwd(), 'vercel', answers.type), { recursive: true });
    await writeFile(functionPath, functionCode);
    
    console.log(chalk.green(`✅ Function scaffolded at ${functionPath}`));
    console.log(chalk.yellow('\nNext steps:'));
    console.log('  1. Test locally with: vercel dev');
    console.log('  2. Deploy with: vercel --prod');
  } catch (error) {
    console.error(chalk.red('❌ Failed to scaffold function:'), error);
    process.exit(1);
  }
}
