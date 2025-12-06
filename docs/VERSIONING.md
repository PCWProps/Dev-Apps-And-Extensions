# Versioning Strategy

## 📌 Overview

This monorepo uses [Semantic Versioning 2.0.0](https://semver.org/) (SemVer) for all packages and extensions.

## 🔢 Version Format

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]

Example: 1.2.3-beta.1+20240106
```

### Components

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)
- **PRERELEASE**: alpha, beta, rc (optional)
- **BUILD**: Build metadata (optional)

## 📦 Package Versioning

### Independent Versioning

Each package maintains its own version:

```
extensions/core-extension    → v1.2.3
extensions/pro-extension     → v1.2.1
cloudflare                   → v0.9.5
vercel                       → v0.8.2
```

### Version Synchronization

Related packages should coordinate major versions:

```
core-extension v2.0.0
pro-extension  v2.0.0  ← Same major version
```

## 🚀 Release Types

### Stable Releases

**Format**: `X.Y.Z`

```bash
# Example
v1.0.0  # Initial release
v1.1.0  # Feature addition
v1.1.1  # Bug fix
```

**Criteria**:
- All tests passing
- Documentation updated
- Reviewed and approved
- Stable for production

### Pre-releases

**Alpha**: Early development
```
v2.0.0-alpha.1
v2.0.0-alpha.2
```

**Beta**: Feature complete, needs testing
```
v2.0.0-beta.1
v2.0.0-beta.2
```

**Release Candidate**: Final testing
```
v2.0.0-rc.1
v2.0.0-rc.2
```

## 📋 Version Bump Rules

### MAJOR Version (X.0.0)

Bump when:
- Breaking API changes
- Removing features
- Major architectural changes
- Incompatible with previous version

**Example**:
```typescript
// v1.x.x
function process(data: string): void

// v2.0.0 - Breaking change
function process(data: ProcessData): Promise<void>
```

### MINOR Version (X.Y.0)

Bump when:
- Adding new features
- Adding optional parameters
- Deprecating features (not removing)
- Backward-compatible changes

**Example**:
```typescript
// v1.2.0
function process(data: string, options?: Options): void

// v1.3.0 - New optional feature
function process(data: string, options?: Options, callback?: Function): void
```

### PATCH Version (X.Y.Z)

Bump when:
- Bug fixes
- Performance improvements
- Documentation updates
- Internal refactoring

**Example**:
```typescript
// v1.2.3 - Fix null handling
function process(data: string): void {
  if (!data) return; // Bug fix
  // ... processing
}
```

## 🔄 Version Workflow

### Development Flow

```
main (v1.2.3)
    ↓
develop (v1.3.0-dev)
    ↓
feature/new-feature
    ↓
PR to develop
    ↓
develop (v1.3.0-beta.1)
    ↓
staging tests
    ↓
PR to main
    ↓
main (v1.3.0)
```

### Release Process

1. **Prepare Release**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Bump Version**
   ```bash
   # For extensions
   cd extensions/core-extension
   npm version minor  # or major/patch
   
   # Update CHANGELOG.md
   ```

3. **Create Release Branch**
   ```bash
   git checkout -b release/v1.3.0
   git push origin release/v1.3.0
   ```

4. **Test & Verify**
   ```bash
   pnpm build
   pnpm test
   pnpm lint
   ```

5. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.3.0
   git tag v1.3.0
   git push origin main --tags
   ```

6. **Publish**
   ```bash
   pnpm publish:extensions
   ```

## 📝 Changelog Management

### Format

Use [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

## [Unreleased]
### Added
- New feature X

### Changed
- Updated feature Y

### Fixed
- Bug fix Z

## [1.2.0] - 2024-01-15
### Added
- Feature A
- Feature B

### Changed
- Improved performance

### Fixed
- Critical bug fix

## [1.1.0] - 2024-01-01
...
```

### Automation

```bash
# Generate changelog
pnpm run changelog:generate

# Update changelog
pnpm run changelog:update
```

## 🏷️ Git Tagging

### Tag Format

```
v[VERSION]

Examples:
v1.0.0
v1.2.3-beta.1
v2.0.0-rc.1
```

### Creating Tags

```bash
# Lightweight tag
git tag v1.2.3

# Annotated tag (recommended)
git tag -a v1.2.3 -m "Release version 1.2.3"

# Push tags
git push origin v1.2.3
git push origin --tags
```

### Tag Naming Convention

```
extensions/core-extension    → core-v1.2.3
extensions/pro-extension     → pro-v1.2.3
cloudflare                   → cf-v1.2.3
vercel                       → vercel-v1.2.3
```

## 🎯 Version Compatibility

### Extension Compatibility Matrix

| Core Version | Pro Version | Supported |
|--------------|-------------|-----------|
| 1.x.x | 1.x.x | ✅ Yes |
| 1.x.x | 2.x.x | ❌ No |
| 2.x.x | 2.x.x | ✅ Yes |

### API Compatibility

Maintain compatibility for:
- Same major version
- One major version back (with deprecation warnings)

Example:
```typescript
// v1.x.x API
interface Config {
  option1: string;
  option2?: number;
}

// v2.x.x API (backward compatible)
interface Config {
  option1: string;
  option2?: number;
  option3?: boolean;  // New optional field
}
```

## 🔐 Version Constraints

### Package.json Dependencies

```json
{
  "dependencies": {
    "exact-version": "1.2.3",
    "caret-range": "^1.2.3",    // >=1.2.3 <2.0.0
    "tilde-range": "~1.2.3",    // >=1.2.3 <1.3.0
    "any-version": "*"
  }
}
```

### Recommended Constraints

- **Internal packages**: `workspace:*`
- **Stable dependencies**: `^X.Y.Z`
- **Breaking-prone**: `~X.Y.Z`
- **Exact version**: `X.Y.Z` (rarely)

## 📊 Version Tracking

### Current Versions

Track in root `package.json`:

```json
{
  "workspaces": {
    "packages": [
      "extensions/*",
      "cloudflare",
      "vercel"
    ]
  },
  "versions": {
    "core-extension": "1.2.3",
    "pro-extension": "1.2.1",
    "cloudflare": "0.9.5"
  }
}
```

### Version Commands

```bash
# List all versions
pnpm list --depth=0

# Check for updates
pnpm outdated

# Update dependencies
pnpm update
```

## 🚨 Breaking Changes

### Communication

1. **Documentation**: Update migration guide
2. **Changelog**: List all breaking changes
3. **Code**: Add deprecation warnings
4. **Timeline**: Provide migration period

### Example Migration Guide

```markdown
## Migrating to v2.0.0

### Breaking Changes

#### API Changes

**Old (v1.x.x)**:
```typescript
import { process } from 'package';
process(data);
```

**New (v2.0.0)**:
```typescript
import { process } from 'package';
await process(data);  // Now returns Promise
```

#### Configuration Changes

**Old**: `config.json`
**New**: `config.yaml`

### Migration Steps

1. Update imports
2. Add async/await
3. Convert config files
4. Test thoroughly
```

## 🔮 Future Versioning

### Planned Versions

- **v1.3.0**: Q1 2024 - Feature X
- **v1.4.0**: Q2 2024 - Feature Y
- **v2.0.0**: Q3 2024 - Major rewrite

### Version Roadmap

Track in GitHub Projects/Milestones

## 📚 References

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🤝 Contributing

When bumping versions:
1. Follow SemVer strictly
2. Update CHANGELOG.md
3. Update documentation
4. Add git tag
5. Create GitHub release
