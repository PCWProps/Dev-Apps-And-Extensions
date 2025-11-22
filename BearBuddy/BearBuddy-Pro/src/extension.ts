import * as vscode from 'vscode';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('BearBuddy Pro is now active!');

  // Register the hello world command
  let helloDisposable = vscode.commands.registerCommand('bearbuddy-pro.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from BearBuddy Pro! 🐻✨');
  });

  // Register the advanced feature command (Pro exclusive)
  let advancedDisposable = vscode.commands.registerCommand('bearbuddy-pro.advancedFeature', () => {
    vscode.window.showInformationMessage('This is a Pro-exclusive advanced feature! 🚀');
  });

  context.subscriptions.push(helloDisposable, advancedDisposable);

  // Show welcome message
  vscode.window.showInformationMessage('BearBuddy Pro has been activated! 🐻✨');
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {
  console.log('BearBuddy Pro has been deactivated');
}
