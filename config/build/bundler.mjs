#!/usr/bin/env node
import * as esbuild from 'esbuild';
import { resolve } from 'path';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {esbuild.BuildOptions}
 */
const buildOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': production ? '"production"' : '"development"',
  },
};

async function main() {
  if (watch) {
    const context = await esbuild.context(buildOptions);
    await context.watch();
    console.log('Watching for changes...');
  } else {
    await esbuild.build(buildOptions);
    console.log('Build complete!');
  }
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
