#!/usr/bin/env ts-node
import { Command } from 'commander';
import chalk from 'chalk';
import { scaffoldExtension } from './commands/scaffold-extension';
import { scaffoldWorker } from './commands/scaffold-worker';
import { scaffoldVercel } from './commands/scaffold-vercel';
import { checkEnv } from './commands/check-env';

const program = new Command();

program
  .name('repo-cli')
  .description('CLI tool for managing the monorepo')
  .version('1.0.0');

program
  .command('scaffold-extension')
  .description('Scaffold a new VS Code extension')
  .option('-n, --name <name>', 'Extension name')
  .option('-d, --description <description>', 'Extension description')
  .action(scaffoldExtension);

program
  .command('scaffold-worker')
  .description('Scaffold a new Cloudflare Worker')
  .option('-n, --name <name>', 'Worker name')
  .action(scaffoldWorker);

program
  .command('scaffold-vercel')
  .description('Scaffold a new Vercel function')
  .option('-n, --name <name>', 'Function name')
  .option('-t, --type <type>', 'Function type (edge|api)')
  .action(scaffoldVercel);

program
  .command('check-env')
  .description('Check environment configuration')
  .argument('[environment]', 'Environment to check (dev|staging|prod)', 'dev')
  .action(checkEnv);

program.parse();
