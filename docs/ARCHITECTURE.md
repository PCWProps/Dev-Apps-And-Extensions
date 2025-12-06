# Architecture Documentation

## 🏗️ System Overview

This monorepo implements a distributed architecture for VS Code extensions with cloud-native backend services.

## 📐 High-Level Architecture

```
┌─────────────────┐
│   VS Code IDE   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ Core │  │ Pro  │
│ Ext  │  │ Ext  │
└───┬──┘  └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────▼─────────────┐
    │  Edge Services   │
    ├──────────────────┤
    │ Vercel + CF      │
    └────┬─────────────┘
         │
    ┌────▼─────────────┐
    │  Storage Layer   │
    ├──────────────────┤
    │ KV, R2, D1, Vec  │
    └──────────────────┘
```

## 🎨 Extension Architecture

### Core Extension (Free)

**Purpose**: Provide base functionality available to all users

**Components**:
- Command handlers
- Base features
- Webviews
- Syntax highlighting
- Snippets

**License**: MIT (Open Source)

### Pro Extension (Paid)

**Purpose**: Advanced features requiring license validation

**Components**:
- Advanced commands
- Premium features
- License validation
- Cloud synchronization
- Priority support

**License**: Proprietary

### Extension Communication Flow

```
Extension Activation
    ↓
Load Configuration
    ↓
Initialize Features
    ↓
Register Commands
    ↓
Validate License (Pro only)
    ↓
Enable Features
```

## ☁️ Cloud Architecture

### Cloudflare Workers

**Purpose**: Edge computing for low-latency operations

**Services**:

1. **Authentication** (`auth.ts`)
   - JWT token generation
   - Token validation
   - Session management

2. **License Management** (`license.ts`)
   - License validation
   - Activation tracking
   - Subscription status

3. **Analytics** (`analytics.ts`)
   - Usage metrics
   - Error tracking
   - Performance monitoring

4. **Stripe Webhooks** (`stripe-webhooks.ts`)
   - Payment processing
   - Subscription events
   - Refund handling

**Storage**:
- **KV**: Session tokens, cache
- **R2**: Asset storage, backups
- **D1**: Relational data, licenses
- **Vectorize**: Semantic search
- **Queues**: Async processing

### Vercel Edge/API

**Purpose**: Regional compute and API endpoints

**Functions**:

1. **Edge Functions**:
   - Rate limiting
   - Authentication middleware
   - CDN optimization

2. **API Routes**:
   - License checking
   - Customer portal
   - Telemetry collection

### Data Flow

```
User Action → Extension
    ↓
Local Processing
    ↓
API Request → Vercel Edge
    ↓
Rate Limit Check
    ↓
Forward → Cloudflare Worker
    ↓
Process & Store → KV/D1/R2
    ↓
Response → Edge → Extension
```

## 🗄️ Storage Strategy

### KV (Key-Value Store)

**Use Cases**:
- Session tokens
- Cache layer
- Feature flags
- Rate limit counters

**Characteristics**:
- Global replication
- Eventually consistent
- High read throughput

### R2 (Object Storage)

**Use Cases**:
- Extension packages
- User uploads
- Backup archives
- Static assets

**Characteristics**:
- S3-compatible API
- Zero egress fees
- Global distribution

### D1 (SQLite)

**Use Cases**:
- User accounts
- License records
- Subscription data
- Audit logs

**Characteristics**:
- SQL interface
- ACID transactions
- Automatic replication

### Vectorize (Vector DB)

**Use Cases**:
- Semantic search
- Code similarity
- Recommendation engine

**Characteristics**:
- Vector embeddings
- Fast similarity search
- Integrated with Workers

## 🔐 Security Architecture

### Authentication Flow

1. User initiates auth in extension
2. Extension opens OAuth flow
3. User authenticates with provider
4. Backend generates JWT token
5. Extension stores token securely
6. Token used for API requests

### License Validation

```
Pro Extension Start
    ↓
Read Local License
    ↓
Validate with API
    ↓
Check Expiration
    ↓
Verify Signature
    ↓
Enable/Disable Features
```

### Security Layers

1. **Transport**: TLS 1.3
2. **Authentication**: JWT with RS256
3. **Authorization**: Role-based access
4. **Validation**: Input sanitization
5. **Rate Limiting**: Per-user quotas
6. **Audit**: Activity logging

## 🚀 Build & Deploy Architecture

### Build Pipeline

```
Code Change → Git Push
    ↓
Turborepo Build
    ↓
Parallel Execution
    ├─ Lint
    ├─ Type Check
    ├─ Test
    └─ Build
    ↓
Artifacts Generated
```

### Deployment Targets

1. **Extensions**:
   - VS Code Marketplace
   - Open VSX Registry

2. **Cloudflare**:
   - Workers (global edge)
   - KV/R2/D1/Vectorize

3. **Vercel**:
   - Edge Functions
   - API Routes

4. **Website**:
   - GitHub Pages
   - Jekyll build

## 📦 Package Architecture

### Dependency Graph

```
extensions/core-extension
    ↓
tools/shared-utils
    ↓
tools/logger

extensions/pro-extension
    ↓
tools/shared-utils (licensing)
    ↓
tools/logger
```

### Shared Dependencies

- `tools/logger`: Centralized logging
- `tools/shared-utils`: Common utilities
- `config/*`: Shared configurations

## 🔄 Data Synchronization

### Sync Architecture

```
Extension State Change
    ↓
Queue Sync Event
    ↓
Background Worker
    ↓
Cloudflare Queue
    ↓
Worker Processing
    ↓
Store in D1/KV
    ↓
Notify Other Devices
```

## 📊 Monitoring Architecture

### Metrics Collection

1. **Extension Telemetry**:
   - Activation events
   - Command usage
   - Error rates
   - Performance metrics

2. **API Metrics**:
   - Request count
   - Response times
   - Error rates
   - Geographic distribution

3. **Business Metrics**:
   - Active users
   - License activations
   - Feature usage
   - Conversion rates

### Observability Stack

- **Logs**: Cloudflare Logs + Custom logger
- **Metrics**: Custom dashboards
- **Traces**: Request correlation
- **Alerts**: Threshold monitoring

## 🔧 Development Architecture

### Monorepo Structure

```
pnpm workspace (package manager)
    ↓
Turborepo (build orchestration)
    ↓
TypeScript (language)
    ↓
Individual packages
```

### Development Workflow

1. Local development with watch mode
2. Hot reload for quick iteration
3. Type checking on save
4. Pre-commit hooks
5. CI validation on push

## 🌐 Multi-Environment Strategy

### Environment Separation

- **Development**: Local + dev cloud resources
- **Staging**: Isolated test environment
- **Production**: Live user environment

### Configuration Management

Each environment has:
- Separate Cloudflare accounts/resources
- Isolated Vercel projects
- Environment-specific secrets
- Different API endpoints

## 📈 Scalability Considerations

### Horizontal Scaling

- Cloudflare Workers: Auto-scale globally
- Vercel Functions: Regional auto-scale
- D1: Automatic read replicas

### Performance Optimization

1. **Caching**: Aggressive KV caching
2. **CDN**: Static asset delivery
3. **Code Splitting**: Lazy loading
4. **Bundling**: Optimized builds

## 🔮 Future Architecture

### Planned Enhancements

1. **Multi-region D1**: Geographic data locality
2. **Real-time Sync**: WebSocket connections
3. **Offline Support**: Local-first architecture
4. **Plugin System**: Extensibility framework

## 📚 Architecture Decisions

### Why Cloudflare Workers?

- Global edge deployment
- Low latency
- Cost-effective
- Rich ecosystem

### Why Vercel Edge?

- Next.js integration
- Regional compute
- Easy deployment
- Great DX

### Why Turborepo?

- Fast incremental builds
- Remote caching
- Task orchestration
- Monorepo-native

### Why pnpm?

- Disk space efficient
- Fast installation
- Strict dependency resolution
- Workspace support

## 🤝 Integration Points

### External Services

1. **Stripe**: Payment processing
2. **OAuth Providers**: Authentication
3. **GitHub**: Source control
4. **VS Code Marketplace**: Distribution

### Webhooks

- Stripe events → Cloudflare Worker
- GitHub events → Automation
- License changes → Extension notification

## 📖 References

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
