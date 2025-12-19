# VS Code Extension Development Guide

## 🎯 Overview

This guide covers development, testing, and publishing of VS Code extensions in the monorepo.

## 📦 Extension Structure

### Core Extension (Free)

```
extensions/core-extension/
├── package.json          # Extension manifest
├── tsconfig.json        # TypeScript config
├── src/
│   ├── extension.ts     # Main entry point
│   ├── commands/        # Command implementations
│   ├── features/        # Feature modules
│   └── webviews/        # Webview panels
├── media/               # Icons, images
├── snippets/            # Code snippets
├── syntaxes/            # Syntax definitions
├── CHANGELOG.md         # Version history
├── README.md            # Extension docs
└── .vscodeignore        # Package exclusions
```

### Pro Extension (Paid)

```
extensions/pro-extension/
├── package.json
├── tsconfig.json
├── src/
│   ├── extension.ts
│   └── licensing/
│       ├── activatePaidFeatures.ts
│       └── checkLicense.ts
├── media/
├── CHANGELOG.md
├── README.md
└── .vscodeignore
```

## 🚀 Getting Started

### Prerequisites

```bash
# Install VS Code Extension Manager
npm install -g @vscode/vsce

# Install dependencies
cd extensions/core-extension
pnpm install
```

### Development Setup

1. **Open in VS Code**
   ```bash
   code extensions/core-extension
   ```

2. **Start Watch Mode**
   ```bash
   pnpm run watch
   ```

3. **Launch Extension**
   - Press `F5` to open Extension Development Host
   - Test your extension in the new window

### Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Core Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}/extensions/core-extension"
      ],
      "outFiles": [
        "${workspaceFolder}/extensions/core-extension/dist/**/*.js"
      ],
      "preLaunchTask": "npm: watch"
    }
  ]
}
```

## 🛠️ Creating Commands

### Basic Command

```typescript
// src/commands/helloWorld.ts
import * as vscode from 'vscode';

export function registerHelloWorld(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(disposable);
}
```

### Command with Input

```typescript
export function registerGreetUser(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.greetUser',
    async () => {
      const name = await vscode.window.showInputBox({
        prompt: 'Enter your name',
        placeHolder: 'John Doe'
      });

      if (name) {
        vscode.window.showInformationMessage(`Hello, ${name}!`);
      }
    }
  );

  context.subscriptions.push(disposable);
}
```

## 🎨 Creating Webviews

### Basic Webview

```typescript
// src/webviews/panel.ts
import * as vscode from 'vscode';

export class MyWebviewPanel {
  public static currentPanel: MyWebviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._update();
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MyWebviewPanel.currentPanel) {
      MyWebviewPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'myWebview',
      'My Webview',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
      }
    );

    MyWebviewPanel.currentPanel = new MyWebviewPanel(panel, extensionUri);
  }

  private _update() {
    this._panel.webview.html = this._getHtmlContent();
  }

  private _getHtmlContent(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Webview</title>
      </head>
      <body>
        <h1>Hello from Webview!</h1>
      </body>
      </html>
    `;
  }

  public dispose() {
    MyWebviewPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
```

## 💎 Pro Features & Licensing

### License Check

```typescript
// extensions/pro-extension/src/licensing/checkLicense.ts
import * as vscode from 'vscode';

export interface LicenseInfo {
  valid: boolean;
  email?: string;
  expiresAt?: Date;
  tier?: 'basic' | 'premium' | 'enterprise';
}

export async function checkLicense(): Promise<LicenseInfo> {
  // Get stored license key
  const config = vscode.workspace.getConfiguration('bearbuddy-pro');
  const licenseKey = config.get<string>('licenseKey');

  if (!licenseKey) {
    return { valid: false };
  }

  try {
    // Validate with backend
    const response = await fetch('https://api.example.com/license/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ licenseKey })
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return {
      valid: true,
      email: data.email,
      expiresAt: new Date(data.expiresAt),
      tier: data.tier
    };
  } catch (error) {
    console.error('License validation failed:', error);
    return { valid: false };
  }
}
```

### Activate Paid Features

```typescript
// extensions/pro-extension/src/licensing/activatePaidFeatures.ts
import * as vscode from 'vscode';
import { checkLicense, LicenseInfo } from './checkLicense';

export async function activatePaidFeatures(
  context: vscode.ExtensionContext
): Promise<boolean> {
  const license = await checkLicense();

  if (!license.valid) {
    vscode.window.showWarningMessage(
      'BearBuddy Pro: Invalid or missing license. Some features are disabled.',
      'Enter License Key'
    ).then(selection => {
      if (selection === 'Enter License Key') {
        promptForLicenseKey();
      }
    });
    return false;
  }

  // Store license info
  context.globalState.update('licenseInfo', license);

  // Enable pro features based on tier
  if (license.tier === 'enterprise') {
    registerEnterpriseFeatures(context);
  }

  vscode.window.showInformationMessage(
    `BearBuddy Pro activated for ${license.email}`
  );

  return true;
}

async function promptForLicenseKey() {
  const key = await vscode.window.showInputBox({
    prompt: 'Enter your BearBuddy Pro license key',
    password: true,
    validateInput: (value) => {
      if (!value || value.length < 10) {
        return 'License key is required';
      }
      return null;
    }
  });

  if (key) {
    const config = vscode.workspace.getConfiguration('bearbuddy-pro');
    await config.update('licenseKey', key, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('License key saved. Reloading...');
    vscode.commands.executeCommand('workbench.action.reloadWindow');
  }
}

function registerEnterpriseFeatures(context: vscode.ExtensionContext) {
  // Register enterprise-only commands
  const disposable = vscode.commands.registerCommand(
    'bearbuddy-pro.enterpriseFeature',
    () => {
      vscode.window.showInformationMessage(
        'Enterprise feature activated!'
      );
    }
  );
  context.subscriptions.push(disposable);
}
```

## 🧪 Testing Extensions

### Unit Tests

```typescript
// src/__tests__/extension.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('PCWProps.bearbuddy-free'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('PCWProps.bearbuddy-free');
    await ext?.activate();
    assert.ok(ext?.isActive);
  });

  test('Command should be registered', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('bearbuddy-free.helloWorld'));
  });
});
```

### Integration Tests

```typescript
// src/__tests__/integration.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Integration Test Suite', () => {
  test('Command execution', async () => {
    await vscode.commands.executeCommand('bearbuddy-free.helloWorld');
    // Verify command effects
  });

  test('Configuration updates', async () => {
    const config = vscode.workspace.getConfiguration('bearbuddy-free');
    await config.update('setting1', 'value1', vscode.ConfigurationTarget.Global);
    const value = config.get<string>('setting1');
    assert.strictEqual(value, 'value1');
  });
});
```

## 📦 Building & Packaging

### Build

```bash
# Build for development
pnpm run build

# Build for production
pnpm run build:production
```

### Package

```bash
# Create .vsix file
pnpm run package

# Package with pre-release flag
vsce package --pre-release
```

### Package.json Configuration

```json
{
  "name": "bearbuddy-free",
  "displayName": "BearBuddy Free",
  "version": "1.0.0",
  "publisher": "PCWProps",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": ["Other"],
  "activationEvents": ["onStartupFinished"],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "bearbuddy-free.helloWorld",
        "title": "BearBuddy: Hello World"
      }
    ],
    "configuration": {
      "title": "BearBuddy",
      "properties": {
        "bearbuddy.setting1": {
          "type": "string",
          "default": "value",
          "description": "Setting description"
        }
      }
    }
  }
}
```

## 🚀 Publishing

### VS Code Marketplace

```bash
# Login
vsce login PCWProps

# Publish
vsce publish

# Publish specific version
vsce publish minor
vsce publish 1.0.1
```

### Open VSX

```bash
# Publish to Open VSX
npx ovsx publish -p <token>
```

## 📝 Best Practices

### Performance

- ✅ Lazy load features
- ✅ Use activation events wisely
- ✅ Dispose resources properly
- ✅ Minimize extension size

### UX

- ✅ Provide clear error messages
- ✅ Use progress indicators
- ✅ Implement undo/redo
- ✅ Support keyboard shortcuts

### Security

- ✅ Validate all inputs
- ✅ Use HTTPS for API calls
- ✅ Store secrets securely
- ✅ Sanitize user data

## 🔧 Troubleshooting

### Extension Not Activating

1. Check activation events
2. Verify package.json
3. Check console for errors
4. Test in clean VS Code instance

### Commands Not Registered

1. Verify command IDs
2. Check registration code
3. Ensure proper disposal
4. Test command palette

## 📚 Resources

- [VS Code API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
