# GitHub Copilot Instructions for Dev-Apps-And-Extensions

## Repository Overview

This is a monorepo for development of applications and extensions. It currently contains:

- **BearBuddy**: A VSCode extension project with Free (MIT) and Pro (Proprietary) editions

## Repository Structure

```
/
├── BearBuddy/                      # VSCode extension monorepo
│   ├── BearBuddy-Free/             # Free edition (MIT License)
│   │   ├── src/                    # TypeScript source files
│   │   │   └── extension.ts        # Main extension entry point
│   │   ├── package.json            # Extension manifest & dependencies
│   │   ├── tsconfig.json           # TypeScript configuration
│   │   └── esbuild.js              # Build configuration
│   ├── BearBuddy-Pro/              # Pro edition (Proprietary License)
│   │   ├── src/                    # TypeScript source files
│   │   │   └── extension.ts        # Main extension entry point
│   │   ├── package.json            # Extension manifest & dependencies
│   │   ├── tsconfig.json           # TypeScript configuration
│   │   └── esbuild.js              # Build configuration
│   ├── docs/                       # GitHub Pages documentation
│   └── package.json                # Monorepo root configuration
├── .github/                        # GitHub configuration
│   ├── workflows/                  # GitHub Actions workflows
│   ├── ISSUE_TEMPLATE/             # Issue templates
│   └── pull_request_template.md    # PR template
└── README.md                       # Repository documentation
```

## Technologies & Tools

- **Language**: TypeScript
- **Package Manager**: npm with workspaces
- **Build Tool**: esbuild for fast bundling
- **Platform**: VSCode Extension API (^1.80.0)
- **Node Version**: >= 18.0.0
- **npm Version**: >= 9.0.0

## Development Workflow

### Setup & Installation

```bash
# Install dependencies for all projects
cd BearBuddy
npm install
```

### Building

```bash
# Build all projects from BearBuddy directory
npm run build

# Build specific edition
npm run build:free
npm run build:pro
```

### Development (Watch Mode)

```bash
# Watch all projects
npm run watch

# Watch specific edition
npm run watch:free
npm run watch:pro
```

### Packaging

```bash
# Package all extensions
npm run package

# Package specific edition
npm run package:free
npm run package:pro
```

### Testing

```bash
# Run tests (currently placeholder)
npm run test
```

### Linting

```bash
# Run linting (currently placeholder)
npm run lint
```

## Code Style & Conventions

### TypeScript

- Use TypeScript for all source files
- Enable strict type checking
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow VSCode extension best practices

### Git Commits

Follow conventional commit format:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## License Considerations

### BearBuddy Free

- **License**: MIT (Open Source)
- **Location**: `BearBuddy/BearBuddy-Free/`
- **Contributions**: Accepted for core features

### BearBuddy Pro

- **License**: Proprietary
- **Location**: `BearBuddy/BearBuddy-Pro/`
- **Contributions**: Limited to bug fixes and optimizations

**Important**: When making changes, be mindful of which edition you're working in and respect the license boundaries.

## Working with the Monorepo

- This repository uses npm workspaces for managing multiple packages
- Always run commands from the appropriate directory:
  - Monorepo-level commands: from `BearBuddy/` directory
  - Edition-specific work: from `BearBuddy/BearBuddy-Free/` or `BearBuddy/BearBuddy-Pro/`
- Changes to one edition should not affect the other unless explicitly intended

## Testing VSCode Extensions

1. Open the project in VSCode
2. Press F5 to launch the Extension Development Host
3. Test your changes in the new VSCode window
4. Check the Debug Console for logs and errors
5. Use VSCode Extension Development best practices

## Important Notes

- Build artifacts are in `dist/` directories (ignored by git)
- Packaged extensions are `.vsix` files (ignored by git)
- `node_modules/` is ignored by git
- Always test extensions in the Extension Development Host before committing

## Documentation

- Main docs are in the `BearBuddy/docs/` directory
- Documentation is published to GitHub Pages
- Keep README files up to date when making significant changes

## Before Submitting Changes

1. Ensure code builds without errors
2. Test the extension in VSCode Extension Development Host
3. Follow the existing code style
4. Update documentation if needed
5. Write clear commit messages using conventional commit format
6. Verify you're working in the correct edition (Free vs Pro)
