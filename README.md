# Dev Apps & Extensions - Production Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/repo)

A production-grade monorepo for VS Code extensions, cloud infrastructure, and web applications using pnpm + Turborepo.

## 🏗️ Architecture

This monorepo contains:

- 🎨 **VS Code Extensions** - Core (Free/MIT) and Pro (Paid) editions with licensing
- ☁️ **Cloudflare Workers** - Auth, licensing, analytics, Stripe webhooks (KV, R2, D1, Vectorize, Queues)
- ⚡ **Vercel Edge/API** - Rate limiting, authentication, license validation
- 📚 **GitHub Pages** - Jekyll-based documentation website
- 🛠️ **Shared Tools** - Logging, utilities, dev tooling
- 🤖 **Automation** - CLI tools, scripts, generators

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >=18.0.0
- **pnpm**: >=8.0.0 (install: `npm install -g pnpm`)
- **VS Code**: >=1.80.0 (for extension development)

### Installation

```bash
# Clone the repository
git clone https://github.com/PCWProps/Dev-Apps-And-Extensions.git
cd Dev-Apps-And-Extensions

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## 📦 Workspace Packages

### Extensions

- **`extensions/core-extension`** - BearBuddy Core (Free/MIT) - Base functionality
- **`extensions/pro-extension`** - BearBuddy Pro (Paid) - Advanced features with licensing

### Cloud Infrastructure

- **`cloudflare`** - Cloudflare Workers for backend services
- **`vercel`** - Vercel Edge Functions and API routes
- **`website`** - GitHub Pages documentation site (Jekyll)

### Tools & Automation

- **`tools/logger`** - Shared logging utilities
- **`tools/shared-utils`** - Common utilities and licensing logic
- **`automation`** - CLI tools and automation scripts

## 🔨 Development

### Build Commands

```bash
pnpm build              # Build all packages
pnpm dev                # Start development mode (parallel)
pnpm lint               # Lint all packages
pnpm test               # Run all tests
pnpm type-check         # TypeScript type checking
```

### Extension Development

```bash
# Build extensions
pnpm package:extensions

# Publish to marketplaces
pnpm publish:extensions
```

### CLI Tools

```bash
# Access automation CLI
pnpm cli

# Available commands:
pnpm cli scaffold-extension
pnpm cli scaffold-worker
pnpm cli scaffold-vercel
pnpm cli check-env
```

## 📂 Project Structure

```
monorepo/
├── extensions/          # VS Code extensions
├── cloudflare/          # Cloudflare Workers
├── vercel/             # Vercel Edge/API functions
├── website/            # GitHub Pages site
├── tools/              # Shared utilities
├── automation/         # Scripts and CLI
├── config/             # Shared configurations
├── docs/               # Documentation
├── environments/       # Environment configs
└── infrastructure/     # IaC and seeds
```

## 📖 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design and structure
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[Environments](docs/ENVIRONMENTS.md)** - Environment setup
- **[Versioning](docs/VERSIONING.md)** - Version management
- **[Workflows](docs/WORKFLOWS.md)** - CI/CD pipelines
- **[Extension Guides](docs/extension-guides.md)** - Extension development

## 🌍 Environments

The monorepo supports multiple environments:

- **Development** (`environments/dev/`)
- **Staging** (`environments/staging/`)
- **Production** (`environments/prod/`)

Each environment has dedicated configurations for Cloudflare and Vercel.

## 🔐 Infrastructure

### Cloudflare Services

- KV (Key-Value storage)
- R2 (Object storage)
- D1 (SQLite database)
- Vectorize (Vector database)
- Queues (Message queues)
- Access (Zero Trust)

### Vercel Services

- Edge Functions
- API Routes
- Edge Config

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

- **Monorepo Infrastructure**: MIT License
- **Core Extension**: MIT License
- **Pro Extension**: Proprietary License

See individual package LICENSE files for details.

## 👥 Authors

**PCW|Props** - [@PCWProps](https://github.com/PCWProps)

## 🙏 Acknowledgments

Built with amazing open source tools:
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [Turborepo](https://turbo.build/repo) - High-performance build system
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- [Vercel](https://vercel.com/) - Frontend cloud platform

---

Made with ❤️ by PCW|Props
