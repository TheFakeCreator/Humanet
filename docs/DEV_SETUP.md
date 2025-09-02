# Development Setup Guide

## Prerequisites

Before starting development on Humanet, ensure you have the following installed:

- **Node.js** 18+ (LTS recommended)
- **pnpm** 8+ (package manager)
- **MongoDB** 6+ (database)
- **Git** (version control)
- **Docker** (optional, for containerized development)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd humanet
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 3. Set Up Environment Variables

#### Backend Environment

Copy the example environment file and configure:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
MONGO_URL=mongodb://localhost:27017/humanet
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

#### Frontend Environment

Copy the example environment file and configure:

```bash
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Start MongoDB

#### Option A: Local MongoDB Installation

```bash
# Start MongoDB service (varies by OS)
# macOS with Homebrew:
brew services start mongodb/brew/mongodb-community

# Ubuntu/Debian:
sudo systemctl start mongod

# Windows: Start MongoDB as a service or run manually
```

#### Option B: Docker MongoDB

```bash
docker run --name humanet-mongo -p 27017:27017 -d mongo:7-jammy
```

### 5. Build Shared Package

```bash
pnpm --filter shared build
```

### 6. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm --filter backend dev  # Backend on http://localhost:4000
pnpm --filter frontend dev # Frontend on http://localhost:3000
```

## Detailed Setup

### Database Setup

#### MongoDB Configuration

1. **Create Database**: The application will automatically create the `humanet` database on first connection.

2. **Indexes**: Indexes are automatically created when the application starts via Mongoose schemas.

3. **Sample Data**: To add sample data for development:

```bash
# TODO: Add seed script
pnpm --filter backend run seed
```

### Development Workflow

#### 1. Code Quality

Before making changes, ensure code quality tools are set up:

```bash
# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check
```

#### 2. Git Hooks

Git hooks are automatically installed via Husky:

- **pre-commit**: Runs lint-staged to format and lint changed files
- **pre-push**: Runs tests to ensure code quality

#### 3. Testing

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm --filter backend test

# Run frontend tests
pnpm --filter frontend test

# Run tests in watch mode
pnpm --filter backend test:watch
```

### Workspace Structure

```
humanet/
├── backend/              # Express API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Custom middleware
│   │   ├── validation/   # Zod schemas
│   │   ├── config/       # Configuration
│   │   └── tests/        # Test files
│   ├── Dockerfile
│   └── package.json
├── frontend/             # Next.js React app
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility libraries
│   │   └── styles/       # CSS files
│   ├── Dockerfile
│   └── package.json
├── shared/               # Shared TypeScript types
│   ├── src/
│   │   └── types/        # Common interfaces
│   └── package.json
├── docs/                 # Documentation
├── docker-compose.yml    # Docker orchestration
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root package configuration
```

## Development Scripts

### Root Level Scripts

```bash
# Start development servers
pnpm dev

# Run linting across all workspaces
pnpm lint

# Run tests across all workspaces
pnpm test

# Build all packages
pnpm build
```

### Backend Scripts

```bash
# Development with hot reload
pnpm --filter backend dev

# Build TypeScript
pnpm --filter backend build

# Start production server
pnpm --filter backend start

# Run tests
pnpm --filter backend test

# Run tests in watch mode
pnpm --filter backend test:watch
```

### Frontend Scripts

```bash
# Development server
pnpm --filter frontend dev

# Build for production
pnpm --filter frontend build

# Start production server
pnpm --filter frontend start

# Type checking
pnpm --filter frontend type-check
```

### Shared Scripts

```bash
# Build shared types
pnpm --filter shared build

# Watch mode for development
pnpm --filter shared dev
```

## Docker Development

### Using Docker Compose

Start the entire stack with Docker:

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Services

```bash
# Backend only
docker-compose up backend mongodb

# Frontend only
docker-compose up frontend
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/humanet` | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | Yes |
| `PORT` | Backend server port | `4000` | No |
| `NODE_ENV` | Environment mode | `development` | No |

### Frontend (.env.local)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000/api` | Yes |

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Restart MongoDB service
# macOS:
brew services restart mongodb/brew/mongodb-community

# Ubuntu:
sudo systemctl restart mongod
```

#### 2. Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

#### 3. TypeScript Compilation Errors

```bash
# Clean build cache
pnpm --filter backend run clean
pnpm --filter frontend run clean

# Rebuild shared package
pnpm --filter shared build

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### 4. Dependency Issues

```bash
# Clean all node_modules and reinstall
rm -rf node_modules */node_modules
pnpm install
```

### Performance Issues

#### Database Queries

Enable MongoDB query logging to debug slow queries:

```javascript
// In backend development, add to mongoose connection:
mongoose.set('debug', true);
```

#### Frontend Performance

Use Next.js built-in tools:

```bash
# Analyze bundle size
pnpm --filter frontend run analyze
```

## IDE Setup

### VS Code

Recommended extensions:

- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- MongoDB for VS Code
- Thunder Client (API testing)

Workspace settings (`.vscode/settings.json`):

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "eslint.workingDirectories": ["backend", "frontend", "shared"],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Testing Strategy

### Backend Testing

- **Unit Tests**: Service layer business logic
- **Integration Tests**: API endpoints with database
- **Test Database**: In-memory MongoDB for testing

### Frontend Testing

- **Component Tests**: React component behavior
- **Hook Tests**: Custom React hooks
- **Integration Tests**: User interactions

### End-to-End Testing

Set up Playwright or Cypress for full application testing:

```bash
# Install E2E testing framework
pnpm add -D @playwright/test

# Run E2E tests
pnpm test:e2e
```

## Deployment

### Production Build

```bash
# Build all packages
pnpm build

# Test production builds locally
docker-compose -f docker-compose.prod.yml up
```

### Environment Configuration

Ensure production environment variables are set:

- Strong JWT secret
- Production MongoDB URL
- Correct CORS origins
- SSL/TLS configuration

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style

- Follow existing code patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## Getting Help

- Check the [Architecture Documentation](./ARCHITECTURE.md)
- Review the [API Documentation](./API.md)
- Search existing issues in the repository
- Create a new issue with detailed information
