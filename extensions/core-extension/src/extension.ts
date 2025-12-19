import * as vscode from 'vscode';
import { createLogger } from '@repo/logger';

const logger = createLogger({ prefix: 'BearBuddy-Core' });

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
  logger.info('BearBuddy Core is now active!');

  // Get configuration
  const config = vscode.workspace.getConfiguration('bearbuddy');
  const showWelcome = config.get<boolean>('showWelcomeMessage', true);

  // Register commands
  registerCommands(context);

  // Show welcome message if enabled
  if (showWelcome) {
    vscode.window.showInformationMessage('BearBuddy Core has been activated! 🐻');
  }

  // Send activation telemetry if enabled
  if (config.get<boolean>('enableTelemetry', true)) {
    sendTelemetry('activation', { version: '1.0.0' });
  }
}

/**
 * Register all extension commands
 */
function registerCommands(context: vscode.ExtensionContext) {
  // Hello World command
  const helloWorldCmd = vscode.commands.registerCommand('bearbuddy-core.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from BearBuddy Core! 🐻');
    sendTelemetry('command:helloWorld');
  });

  // Show Info command
  const showInfoCmd = vscode.commands.registerCommand('bearbuddy-core.showInfo', () => {
    const info = [
      'BearBuddy Core v1.0.0',
      '---',
      'Your friendly coding companion!',
      '',
      'Commands:',
      '• BearBuddy: Hello World',
      '• BearBuddy: Show Info',
      '',
      'Want more features? Check out BearBuddy Pro!',
    ].join('\n');

    vscode.window.showInformationMessage(info, { modal: true });
    sendTelemetry('command:showInfo');
  });

  context.subscriptions.push(helloWorldCmd, showInfoCmd);
}

/**
 * Send telemetry data (if enabled)
 */
function sendTelemetry(eventType: string, data?: Record<string, any>) {
  const config = vscode.workspace.getConfiguration('bearbuddy');
  
  if (!config.get<boolean>('enableTelemetry', true)) {
    return;
  }

  // In production, send to telemetry endpoint
  logger.debug(`Telemetry: ${eventType}`, data);

  // Could send to Vercel API:
  // fetch('https://api.example.com/telemetry', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ type: eventType, data, timestamp: Date.now() }),
  // }).catch(err => logger.warn('Telemetry failed:', err));
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
  logger.info('BearBuddy Core has been deactivated');
  sendTelemetry('deactivation');
}
