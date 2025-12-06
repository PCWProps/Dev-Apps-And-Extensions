import * as vscode from 'vscode';
import { checkLicense } from './checkLicense';
import { createLogger } from '@repo/logger';

const logger = createLogger({ prefix: 'PaidFeatures' });

export async function activatePaidFeatures(
  context: vscode.ExtensionContext
): Promise<boolean> {
  const license = await checkLicense();

  if (!license.valid) {
    vscode.window
      .showWarningMessage(
        'BearBuddy Pro: Invalid or missing license. Some features are disabled.',
        'Enter License Key',
        'Buy License'
      )
      .then(selection => {
        if (selection === 'Enter License Key') {
          vscode.commands.executeCommand('bearbuddy-pro.enterLicense');
        } else if (selection === 'Buy License') {
          vscode.env.openExternal(vscode.Uri.parse('https://example.com/buy'));
        }
      });
    return false;
  }

  await context.globalState.update('licenseInfo', license.license);

  if (license.license) {
    logger.info(\`Activating features for tier: \${license.license.tier}\`);
    vscode.window.showInformationMessage(
      \`BearBuddy Pro activated for \${license.license.email} (\${license.license.tier})\`
    );
  }

  return true;
}
