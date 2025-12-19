import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Core Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('bearbuddy.core-extension'));
  });

  test('Should activate extension', async () => {
    const ext = vscode.extensions.getExtension('bearbuddy.core-extension');
    assert.ok(ext);
    
    await ext!.activate();
    assert.strictEqual(ext!.isActive, true);
  });

  test('Should register bearbuddy.helloWorld command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('bearbuddy.helloWorld'));
  });

  test('Should register bearbuddy.openSettings command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('bearbuddy.openSettings'));
  });

  test('Configuration should have expected properties', () => {
    const config = vscode.workspace.getConfiguration('bearbuddy');
    assert.ok(config);
    assert.strictEqual(typeof config.get('enableTelemetry'), 'boolean');
  });
});
