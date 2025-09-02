# Humanet MVP

A TypeScript monorepo for a collaborative idea sharing and development platform.

## Project Structure

```
humanet/
├── frontend/     # Next.js (TypeScript, App Router), TailwindCSS, React Query
├── backend/      # Node.js + Express (TypeScript, ES Modules), MongoDB with Mongoose
├── shared/       # Shared TypeScript types/interfaces
└── docs/         # Documentation
```

## Features

- **Authentication**: Signup/login/logout with JWT and HttpOnly cookies
- **Ideas**: Create, read, list, search, fork, and upvote ideas
- **Family Trees**: Track idea genealogy with nested tree views
- **Comments**: Comment on ideas
- **Karma System**: Upvotes and forks contribute to user karma

## Local Development

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB (or Docker)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd humanet
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

4. Start MongoDB (if not using Docker):
```bash
# Using Docker
docker run --name humanet-mongo -p 27017:27017 -d mongo

# Or start your local MongoDB instance
```

5. Start development servers:
```bash
pnpm dev
```

This will start:
- Backend API server on http://localhost:4000
- Frontend Next.js server on http://localhost:3000

### Environment Variables

#### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017/humanet
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Scripts

- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build both applications for production
- `pnpm lint` - Lint all workspaces
- `pnpm test` - Run tests in all workspaces

## Technology Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- React Query (TanStack)
- Axios

### Backend
- Node.js
- Express
- TypeScript (ES Modules)
- MongoDB with Mongoose
- JWT Authentication
- Zod Validation

### Development Tools
- ESLint + Prettier
- Husky (Git hooks)
- Jest (Testing)
- Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
