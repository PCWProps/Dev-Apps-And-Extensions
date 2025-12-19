# Contributing Guide

Thank you for your interest in contributing to the Dev Apps & Extensions monorepo! This guide will help you get started.

## 🎯 Code of Conduct

We expect all contributors to follow our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git
- VS Code (recommended)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Dev-Apps-And-Extensions.git
   cd Dev-Apps-And-Extensions
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Workflow

### Making Changes

1. **Write code** following our style guide
2. **Add tests** for new functionality
3. **Update documentation** as needed
4. **Run linting**:
   ```bash
   pnpm lint
   ```
5. **Build the project**:
   ```bash
   pnpm build
   ```
6. **Run tests**:
   ```bash
   pnpm test
   ```

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(extensions): add new command palette feature
fix(cloudflare): resolve auth token validation issue
docs(readme): update installation instructions
```

## 🏗️ Project Structure

### Monorepo Organization

- `extensions/` - VS Code extensions
- `cloudflare/` - Cloudflare Workers
- `vercel/` - Vercel Edge/API functions
- `website/` - Documentation website
- `tools/` - Shared utilities
- `automation/` - CLI and scripts
- `config/` - Shared configurations

### Adding New Packages

Use the CLI to scaffold new packages:

```bash
pnpm cli scaffold-extension
pnpm cli scaffold-worker
pnpm cli scaffold-vercel
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @repo/package-name test

# Run tests in watch mode
pnpm --filter @repo/package-name test:watch
```

### Writing Tests

- Place tests in `__tests__` directories or `*.test.ts` files
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies

## 📚 Documentation

### Code Documentation

- Use JSDoc comments for functions and classes
- Include examples where helpful
- Document complex algorithms
- Keep comments up-to-date

### User Documentation

- Update relevant markdown files
- Add screenshots for UI changes
- Update the website if needed
- Include migration guides for breaking changes

## 🔍 Code Review Process

1. Push your changes to your fork
2. Create a pull request
3. Fill out the PR template
4. Wait for review from maintainers
5. Address feedback
6. Once approved, a maintainer will merge

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] PR description is complete

## 🎨 Style Guide

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Prefer interfaces over types for objects
- Use meaningful variable names
- Avoid `any` type

### Formatting

We use Prettier for formatting:

```bash
pnpm format        # Format all files
pnpm format:check  # Check formatting
```

### Linting

We use ESLint:

```bash
pnpm lint          # Lint all files
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify the bug in the latest version
3. Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Node: [e.g., 18.0.0]
- VS Code: [e.g., 1.80.0]
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Describe the use case
3. Explain the expected behavior
4. Consider implementation complexity

## 📦 Release Process

Maintainers follow this process:

1. Update version numbers
2. Update CHANGELOG.md
3. Create git tag
4. Build and test
5. Publish to registries
6. Create GitHub release

## 🤝 Community

- **Issues**: [Report bugs or request features](https://github.com/PCWProps/Dev-Apps-And-Extensions/issues)
- **Discussions**: [Join conversations](https://github.com/PCWProps/Dev-Apps-And-Extensions/discussions)
- **Discord**: Join our community server

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's licenses:
- Monorepo infrastructure: MIT
- Extensions: See individual LICENSE files

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- README acknowledgments

Thank you for contributing! 🎉
