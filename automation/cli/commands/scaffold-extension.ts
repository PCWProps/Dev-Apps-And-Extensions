import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface ExtensionOptions {
  name?: string;
  description?: string;
}

export async function scaffoldExtension(options: ExtensionOptions) {
  console.log(chalk.blue('🎨 Scaffolding new VS Code extension...'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Extension name:',
      default: options.name || 'my-extension',
      validate: (input: string) => input.length > 0 || 'Name is required',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Extension description:',
      default: options.description || 'My VS Code extension',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Extension type:',
      choices: ['free', 'pro'],
      default: 'free',
    },
  ]);
  
  const extensionPath = resolve(
    process.cwd(),
    'extensions',
    answers.name
  );
  
  try {
    await mkdir(extensionPath, { recursive: true });
    await mkdir(resolve(extensionPath, 'src'), { recursive: true });
    
    // Create package.json
    const packageJson = {
      name: answers.name,
      displayName: answers.name,
      description: answers.description,
      version: '0.1.0',
      engines: { vscode: '^1.80.0' },
      main: './dist/extension.js',
      scripts: {
        build: 'node ../../config/build/bundler.mjs --production',
        watch: 'node ../../config/build/bundler.mjs --watch',
        package: 'vsce package',
        lint: 'eslint src',
        test: 'echo "Tests not yet implemented" && exit 0',
      },
    };
    
    await writeFile(
      resolve(extensionPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create basic extension.ts
    const extensionCode = `import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('${answers.name} is now active!');
  
  const disposable = vscode.commands.registerCommand('${answers.name}.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from ${answers.name}!');
  });
  
  context.subscriptions.push(disposable);
}

export function deactivate() {}
`;
    
    await writeFile(
      resolve(extensionPath, 'src', 'extension.ts'),
      extensionCode
    );
    
    console.log(chalk.green(`✅ Extension scaffolded at ${extensionPath}`));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(`  cd extensions/${answers.name}`);
    console.log('  pnpm install');
    console.log('  pnpm run build');
  } catch (error) {
    console.error(chalk.red('❌ Failed to scaffold extension:'), error);
    process.exit(1);
  }
}
