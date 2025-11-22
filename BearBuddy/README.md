# 🐻 BearBuddy - VSCode Extension Monorepo

Welcome to the BearBuddy monorepo! This repository contains both the free and pro versions of the BearBuddy VSCode extension.

## 📦 Projects

This monorepo contains two VSCode extensions:

### BearBuddy Free (MIT License)
- **Location**: `BearBuddy-Free/`
- **License**: MIT (Open Source)
- **Description**: The free, open-source version of BearBuddy with core features
- **Marketplace**: Coming soon

### BearBuddy Pro (Proprietary License)
- **Location**: `BearBuddy-Pro/`
- **License**: Proprietary
- **Description**: The professional version with advanced features and premium support
- **Marketplace**: Coming soon

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- VSCode >= 1.80.0

### Installation

```bash
# Install dependencies for all projects
npm install
```

### Building

```bash
# Build all projects
npm run build

# Build specific project
npm run build:free
npm run build:pro
```

### Development

```bash
# Watch mode for all projects
npm run watch

# Watch specific project
npm run watch:free
npm run watch:pro
```

### Packaging

```bash
# Package all extensions
npm run package

# Package specific extension
npm run package:free
npm run package:pro
```

## 🏗️ Architecture

This monorepo uses:
- **npm workspaces** for dependency management
- **esbuild** for fast bundling and compilation
- **TypeScript** for type-safe development
- **VSCode Extension API** for extension functionality

## 📚 Documentation

Full documentation is available on our [GitHub Pages](https://pcwprops.github.io/extensions-dev/BearBuddy).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 💬 Community

- **Issues**: [Report bugs or request features](https://github.com/PCWProps/extensions-dev/issues)
- **Discussions**: [Join the conversation](https://github.com/PCWProps/extensions-dev/discussions)
- **Sponsorship**: [Support the project](https://github.com/sponsors/PCWProps)

## 📋 Project Management

Track our progress on the [Project Board](https://github.com/PCWProps/extensions-dev/projects).

## 📄 License

- **BearBuddy Free**: MIT License - see [BearBuddy-Free/LICENSE](./BearBuddy-Free/LICENSE)
- **BearBuddy Pro**: Proprietary License - see [BearBuddy-Pro/LICENSE](./BearBuddy-Pro/LICENSE)

## 👥 Authors

- **PCW|Props** - [GitHub](https://github.com/PCWProps)

---

Made with ❤️ by PCW|Props
