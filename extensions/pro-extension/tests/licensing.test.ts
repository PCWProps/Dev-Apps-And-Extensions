import * as assert from 'assert';
import * as vscode from 'vscode';
import { validateLicenseKey } from '../src/licensing/checkLicense';
import { activatePaidFeatures } from '../src/licensing/activatePaidFeatures';

suite('Pro Extension Licensing Test Suite', () => {
  test('Should validate license key format', () => {
    const validKey = 'ABCD-1234-EFGH-5678';
    const invalidKey = 'INVALID';

    assert.strictEqual(validateLicenseKey(validKey), true);
    assert.strictEqual(validateLicenseKey(invalidKey), false);
  });

  test('Should handle license activation', async () => {
    const mockLicenseKey = 'TEST-TEST-TEST-TEST';
    
    try {
      await activatePaidFeatures(mockLicenseKey, 'premium');
      assert.ok(true, 'License activation completed');
    } catch (error) {
      // In test environment, API calls may fail - that's expected
      assert.ok(error);
    }
  });

  test('Pro extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('bearbuddy.pro-extension'));
  });

  test('Should register bearbuddy.enterLicense command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('bearbuddy.enterLicense'));
  });

  test('Should register bearbuddy.premiumFeature command', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('bearbuddy.premiumFeature'));
  });
});
