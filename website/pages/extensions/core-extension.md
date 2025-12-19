---
layout: page
title: BearBuddy Core Extension
description: Free, open-source VS Code extension for enhanced productivity
---

# BearBuddy Core Extension

The free, MIT-licensed VS Code extension that brings powerful productivity features to your development workflow.

## Features

### 🚀 Core Functionality
- **Smart Code Snippets** - Pre-built snippets for common patterns
- **Configuration Management** - Easy settings management
- **Telemetry** - Anonymous usage analytics (opt-in)
- **Command Palette Integration** - Quick access to all features

### 📦 What's Included

1. **Code Snippets**
   - JavaScript/TypeScript templates
   - Function documentation helpers
   - Error handling patterns

2. **Commands**
   - `bearbuddy.helloWorld` - Quick start command
   - `bearbuddy.openSettings` - Direct settings access

3. **Configuration Options**
   - Enable/disable telemetry
   - Customize behavior
   - Theme integration

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install bearbuddy.core-extension`
4. Press Enter

### From VSIX File

1. Download the `.vsix` file from releases
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
4. Click "..." menu → "Install from VSIX..."
5. Select the downloaded file

## Usage

### Quick Start

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "BearBuddy"
3. Select a command

### Snippets

Type the snippet prefix and press `Tab`:

- `bblog` - Console log with BearBuddy emoji
- `bbfn` - Documented function template
- `bbtry` - Try-catch with error handling
- `bbasync` - Async function template

### Configuration

Open Settings (`Ctrl+,` / `Cmd+,`) and search for "BearBuddy":

```json
{
  "bearbuddy.enableTelemetry": true,
  "bearbuddy.autoUpdate": true
}
```

## Requirements

- VS Code 1.80.0 or higher
- Node.js 18+ (for development)

## Support

- [Report Issues](https://github.com/PCWProps/Dev-Apps-And-Extensions/issues)
- [Documentation](https://bearbuddy.dev/docs)
- [Community Discussions](https://github.com/PCWProps/Dev-Apps-And-Extensions/discussions)

## License

MIT License - See [LICENSE](../../../LICENSE) for details.

## Upgrade to Pro

Want more features? Check out [BearBuddy Pro](./pro-extension.html) for:
- Advanced code analysis
- Team collaboration features
- Priority support
- Premium themes

[Learn More →](./pro-extension.html)
