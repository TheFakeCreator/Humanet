# 🌟 Humanet - Collaborative Idea Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/)

A modern, full-stack collaborative platform where ideas evolve through community interaction. Users can share concepts, build upon others' work through forking, and track the genealogy of innovation through visual family trees.

## 🚀 Features

### Core Functionality
- **💡 Idea Sharing**: Post detailed ideas with rich descriptions, tags, and domain categorization
- **🔀 Forking System**: Build upon existing ideas while maintaining attribution and lineage
- **👍 Voting & Karma**: Community-driven quality assessment with karma rewards
- **💬 Comments**: Engage in discussions around ideas and iterations
- **🌳 Family Trees**: Visualize how ideas evolve and branch over time
- **👤 User Profiles**: Track contributions, karma, and activity history

### Technical Features
- **🔒 JWT Authentication**: Secure user sessions with refresh token support
- **📱 Responsive Design**: Mobile-first UI with TailwindCSS
- **⚡ Real-time Updates**: React Query for efficient data synchronization
- **🔍 Advanced Search**: Filter by domain, tags, popularity, and recency
- **📄 Pagination**: Efficient handling of large datasets
- **🛡️ Input Validation**: Comprehensive data validation with Zod schemas

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React Query   │    │ • Express API   │    │ • Mongoose ODM  │
│ • TailwindCSS   │    │ • JWT Auth      │    │ • Indexes       │
│ • TypeScript    │    │ • Zod Validation│    │ • Aggregation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Shared Types  │
                    │   (TypeScript)  │
                    │                 │
                    │ • API Contracts │
                    │ • Data Models   │
                    │ • Validation    │
                    └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm
- **MongoDB** >= 5.0.0
- **Git** for version control

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/TheFakeCreator/Humanet.git
cd Humanet
```

### 2. Install Dependencies
```bash
# Install all workspace dependencies
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup
```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment  
cp frontend/.env.example frontend/.env.local
```

### 4. Configure Environment Variables

**Backend (`backend/.env`):**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/humanet

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`frontend/.env.local`):**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start Development Servers

**Option A: Start all services**
```bash
pnpm dev
```

**Option B: Start services individually**
```bash
# Terminal 1: Backend
cd backend
pnpm dev

# Terminal 2: Frontend  
cd frontend
pnpm dev

# Terminal 3: MongoDB (if running locally)
mongod
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api/docs (coming soon)

## 📦 Project Structure

```
Humanet/
├── 📁 backend/                 # Node.js API Server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── services/          # Business logic
│   │   ├── routes/            # Express routes
│   │   ├── middlewares/       # Custom middleware
│   │   ├── validation/        # Zod schemas
│   │   ├── config/            # Configuration
│   │   └── tests/             # Test suites
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities & config
│   │   └── types/            # Frontend-specific types
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── 📁 shared/                 # Shared TypeScript Types
│   ├── src/
│   │   ├── types/            # Interface definitions
│   │   └── index.ts          # Exports
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 docs/                   # Documentation
├── 📄 docker-compose.yml      # Development environment
├── 📄 pnpm-workspace.yaml     # Workspace configuration
└── 📄 package.json            # Root package configuration
```

## 🔧 Development

### Available Scripts

**Root level:**
```bash
pnpm dev        # Start all development servers
pnpm build      # Build all packages
pnpm test       # Run all tests
pnpm lint       # Lint all packages
pnpm clean      # Clean build artifacts
```

**Backend:**
```bash
pnpm dev        # Start with nodemon
pnpm build      # TypeScript compilation
pnpm start      # Production start
pnpm test       # Jest tests
pnpm test:watch # Watch mode testing
```

**Frontend:**
```bash
pnpm dev        # Next.js dev server
pnpm build      # Production build
pnpm start      # Production server
pnpm lint       # ESLint checking
```

### Database Setup

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod

# Connect with MongoDB Compass (GUI)
# Connection string: mongodb://localhost:27017
```

**MongoDB Atlas (Cloud):**
```bash
# 1. Create account at https://cloud.mongodb.com/
# 2. Create cluster
# 3. Get connection string
# 4. Update MONGODB_URI in backend/.env
```

### Code Style & Linting

This project uses ESLint and Prettier for consistent code formatting:

```bash
# Check linting
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Format code with Prettier
pnpm format
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Frontend Testing
```bash
cd frontend

# Component tests (when implemented)
pnpm test

# E2E tests (when implemented)
pnpm test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Build all packages
pnpm build

# Test production builds locally
pnpm start
```

### Environment Variables (Production)
Ensure all environment variables are properly set in your production environment:

- Set `NODE_ENV=production`
- Use production MongoDB connection string
- Set secure JWT secrets (use `openssl rand -hex 64`)
- Configure proper CORS origins
- Set production API URLs

### Docker Deployment
```bash
# Build and start with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/signup      # User registration
POST /api/auth/login       # User login  
POST /api/auth/logout      # User logout
GET  /api/auth/me          # Get current user
GET  /api/auth/refresh     # Refresh JWT token
```

### Ideas Endpoints
```http
GET    /api/ideas          # List ideas (with filtering)
POST   /api/ideas          # Create new idea
GET    /api/ideas/:id      # Get specific idea
PUT    /api/ideas/:id      # Update idea
DELETE /api/ideas/:id      # Delete idea
POST   /api/ideas/:id/fork # Fork an idea
POST   /api/ideas/:id/upvote # Toggle upvote
GET    /api/ideas/:id/tree # Get idea family tree
```

### Comments Endpoints  
```http
GET    /api/ideas/:id/comments     # Get idea comments
POST   /api/ideas/:id/comments     # Add comment
PUT    /api/comments/:id           # Update comment
DELETE /api/comments/:id           # Delete comment
```

### Users Endpoints
```http
GET    /api/users/:username        # Get user profile
PUT    /api/users/:username        # Update profile
GET    /api/users/:username/ideas  # Get user's ideas
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code style**: Run `pnpm lint` and `pnpm format`
4. **Add tests**: Ensure new features have test coverage
5. **Commit changes**: Use conventional commit format
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [your-email@example.com]

## 🙏 Acknowledgments

- **Next.js** team for the excellent React framework
- **TanStack Query** for powerful data synchronization
- **MongoDB** for flexible document storage
- **Tailwind CSS** for utility-first styling
- Open source community for inspiration and tools

---

**Built with ❤️ by the Humanet Team**
