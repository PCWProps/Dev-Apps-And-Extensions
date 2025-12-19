import * as vscode from 'vscode';
import { createLogger } from '@repo/logger';
import { checkLicense } from './licensing/checkLicense';
import { activatePaidFeatures } from './licensing/activatePaidFeatures';

const logger = createLogger({ prefix: 'BearBuddy-Pro' });

/**
 * This method is called when your extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  logger.info('BearBuddy Pro is now active!');

  // Register basic commands (available without license)
  registerBasicCommands(context);

  // Check license and activate paid features
  activatePaidFeatures(context).then(isValid => {
    if (isValid) {
      logger.info('BearBuddy Pro features activated');
      registerProCommands(context);
    } else {
      logger.warn('BearBuddy Pro features not activated - invalid or missing license');
    }
  }).catch(error => {
    logger.error('Error activating paid features:', error);
  });

  // Show welcome message
  vscode.window.showInformationMessage('BearBuddy Pro has been activated! 🐻✨');
}

/**
 * Register basic commands (available without license)
 */
function registerBasicCommands(context: vscode.ExtensionContext) {
  // Hello World command
  const helloCmd = vscode.commands.registerCommand('bearbuddy-pro.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from BearBuddy Pro! 🐻✨');
  });

  // Enter License command
  const enterLicenseCmd = vscode.commands.registerCommand('bearbuddy-pro.enterLicense', async () => {
    const licenseKey = await vscode.window.showInputBox({
      prompt: 'Enter your BearBuddy Pro license key',
      password: true,
      placeHolder: 'XXXX-XXXX-XXXX-XXXX',
      validateInput: (value) => {
        if (!value || value.length < 10) {
          return 'Please enter a valid license key';
        }
        return null;
      },
    });

    if (licenseKey) {
      const config = vscode.workspace.getConfiguration('bearbuddy-pro');
      await config.update('licenseKey', licenseKey, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('License key saved. Reloading window...');
      await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
  });

  // Check License command
  const checkLicenseCmd = vscode.commands.registerCommand('bearbuddy-pro.checkLicense', async () => {
    const license = await checkLicense();
    
    if (license.valid && license.license) {
      const expiresAt = license.license.expiresAt.toLocaleDateString();
      vscode.window.showInformationMessage(
        `License is valid!\n` +
        `Tier: ${license.license.tier}\n` +
        `Expires: ${expiresAt}`,
        { modal: true }
      );
    } else {
      vscode.window.showWarningMessage(
        `License is invalid or expired.\n` +
        `Error: ${license.error || 'Unknown error'}`,
        'Enter License Key'
      ).then(selection => {
        if (selection === 'Enter License Key') {
          vscode.commands.executeCommand('bearbuddy-pro.enterLicense');
        }
      });
    }
  });

  context.subscriptions.push(helloCmd, enterLicenseCmd, checkLicenseCmd);
}

/**
 * Register Pro-only commands (require valid license)
 */
function registerProCommands(context: vscode.ExtensionContext) {
  // Advanced Feature command
  const advancedCmd = vscode.commands.registerCommand('bearbuddy-pro.advancedFeature', () => {
    vscode.window.showInformationMessage(
      'This is a Pro-exclusive advanced feature! 🚀\n' +
      'Thank you for supporting BearBuddy Pro!',
      { modal: true }
    );
  });

  context.subscriptions.push(advancedCmd);
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
  logger.info('BearBuddy Pro has been deactivated');
}
