import * as vscode from 'vscode';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('BearBuddy Free is now active!');

  // Register the hello world command
  let disposable = vscode.commands.registerCommand('bearbuddy-free.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from BearBuddy Free! 🐻');
  });

  context.subscriptions.push(disposable);

  // Show welcome message
  vscode.window.showInformationMessage('BearBuddy Free has been activated! 🐻');
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
  console.log('BearBuddy Free has been deactivated');
}
