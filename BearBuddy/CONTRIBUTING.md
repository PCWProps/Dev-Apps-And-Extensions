# Contributing to BearBuddy

Thank you for your interest in contributing to BearBuddy! 🐻

## Code of Conduct

Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (VSCode version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** for the feature
- **Proposed solution** (if you have one)
- **Alternative solutions** considered

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Include tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic
- Write clear commit messages

## Development Setup

### Prerequisites

```bash
# Node.js >= 18.0.0
node --version

# npm >= 9.0.0
npm --version
```

### Setup

```bash
# Clone the repository
git clone https://github.com/PCWProps/extensions-dev.git
cd extensions-dev/BearBuddy

# Install dependencies
npm install

# Build all projects
npm run build
```

### Development Workflow

```bash
# Watch mode for development
npm run watch:free  # For BearBuddy Free
npm run watch:pro   # For BearBuddy Pro

# Build for production
npm run build:free
npm run build:pro

# Package extension
npm run package:free
npm run package:pro
```

### Testing Your Changes

1. Open the project in VSCode
2. Press F5 to launch Extension Development Host
3. Test your changes in the new VSCode window
4. Check the Debug Console for logs

## Project Structure

```
BearBuddy/
├── BearBuddy-Free/          # Free edition (MIT License)
│   ├── src/
│   │   └── extension.ts     # Main extension file
│   ├── package.json
│   ├── tsconfig.json
│   └── esbuild.js
├── BearBuddy-Pro/           # Pro edition (Proprietary)
│   ├── src/
│   │   └── extension.ts     # Main extension file
│   ├── package.json
│   ├── tsconfig.json
│   └── esbuild.js
├── docs/                    # Documentation for GitHub Pages
└── package.json             # Monorepo root
```

## Style Guide

### TypeScript

- Use TypeScript for all source files
- Enable strict type checking
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Git Commits

Follow conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## BearBuddy Free vs Pro

### BearBuddy Free
- **License**: MIT (Open Source)
- **Contributions**: Accepted for core features
- **Location**: `BearBuddy-Free/`

### BearBuddy Pro
- **License**: Proprietary
- **Contributions**: Limited to bug fixes and optimizations
- **Location**: `BearBuddy-Pro/`

## Questions?

- 💬 [Start a discussion](https://github.com/PCWProps/extensions-dev/discussions)
- 📧 Contact the maintainers

## Recognition

Contributors will be recognized in our [CONTRIBUTORS.md](./CONTRIBUTORS.md) file.

---

Thank you for contributing! 🙏
