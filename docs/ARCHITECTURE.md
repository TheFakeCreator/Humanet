# Humanet Architecture

## Overview

Humanet is a TypeScript monorepo application designed for collaborative idea sharing and development. The system allows users to create, share, fork, and track the evolution of ideas through a family tree structure.

## Architecture Principles

### 1. Monorepo Structure
- **Shared Package**: Common TypeScript types and interfaces
- **Backend**: Node.js + Express API server
- **Frontend**: Next.js React application
- **Unified Tooling**: ESLint, Prettier, testing across all packages

### 2. Technology Stack

#### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HttpOnly cookies
- **Validation**: Zod for runtime type checking
- **Testing**: Jest with Supertest for integration tests

#### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors

#### Shared
- **Types**: Common TypeScript interfaces and DTOs
- **Build**: TypeScript compilation to CommonJS and ESM

### 3. Layer Architecture

#### Backend Layers
```
Routes → Controllers → Services → Models → Database
```

- **Routes**: Define API endpoints and middleware
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and data processing
- **Models**: Database schema and validation
- **Middleware**: Authentication, validation, error handling

#### Frontend Layers
```
Pages → Components → Hooks → Services → API
```

- **Pages**: Next.js route components
- **Components**: Reusable UI components
- **Hooks**: React Query hooks for data fetching
- **Services**: Business logic and API calls
- **API**: Axios client with interceptors

## Data Model

### Core Entities

#### User
```typescript
interface User {
  _id: ObjectId
  username: string (unique)
  email: string (unique)
  passwordHash: string
  bio?: string
  karma: number
  skills: string[]
  createdAt: Date
  updatedAt: Date
}
```

#### Idea
```typescript
interface Idea {
  _id: ObjectId
  title: string
  description: string
  tags: string[]
  domain: string[]
  author: ObjectId → User
  parentId?: ObjectId → Idea (for forking)
  upvotes: number
  upvoters: ObjectId[] → User
  forkCount: number
  createdAt: Date
  updatedAt: Date
}
```

#### Comment
```typescript
interface Comment {
  _id: ObjectId
  ideaId: ObjectId → Idea
  authorId: ObjectId → User
  text: string
  createdAt: Date
  updatedAt: Date
}
```

### Relationships

1. **User → Ideas**: One-to-many (author relationship)
2. **User → Comments**: One-to-many (author relationship)
3. **Idea → Comments**: One-to-many
4. **Idea → Ideas**: Self-referencing (parent-child for forks)
5. **User ↔ Ideas**: Many-to-many (upvotes relationship)

## Key Features

### 1. Authentication System
- JWT-based authentication with refresh capability
- HttpOnly cookies for secure token storage
- User registration and login
- Protected routes and middleware

### 2. Idea Management
- CRUD operations for ideas
- Full-text search with MongoDB text indexes
- Tagging and domain categorization
- Pagination and filtering

### 3. Forking System
- Ideas can be forked to create variations
- Parent-child relationships maintained
- Attribution tracking for original authors
- Fork count tracking

### 4. Family Tree Visualization
- Recursive tree structure for idea evolution
- Configurable depth limits
- Efficient querying with aggregation pipelines

### 5. Voting System
- One upvote per user per idea
- Karma system for user reputation
- Real-time vote count updates

### 6. Commenting System
- Threaded comments on ideas
- CRUD operations for comment management
- Author attribution and timestamps

## Security Considerations

### Authentication
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with short expiration times
- HttpOnly cookies to prevent XSS
- CORS configuration for allowed origins

### Input Validation
- Zod schemas for all API inputs
- MongoDB schema validation
- Rate limiting on sensitive endpoints
- SQL injection prevention (NoSQL)

### Authorization
- Route-level authentication middleware
- Resource ownership validation
- User context in protected routes

## Performance Optimizations

### Database
- Strategic indexes on frequently queried fields
- Text search indexes for full-text search
- Aggregation pipelines for complex queries
- Connection pooling with Mongoose

### Caching
- React Query caching for frontend
- Optimistic updates for better UX
- Cache invalidation strategies

### Frontend
- Next.js static generation where applicable
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization

## Scalability Patterns

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Load balancer compatibility
- Container orchestration ready

### Vertical Scaling
- Efficient algorithms for tree traversal
- Pagination for large datasets
- Background job processing capability
- Memory usage optimization

## Development Workflow

### Code Quality
- TypeScript strict mode
- ESLint and Prettier configuration
- Pre-commit hooks with Husky
- Automated testing requirements

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Component testing for React components
- End-to-end testing capability

### CI/CD Pipeline
- Automated testing on pull requests
- Build verification
- Docker image creation
- Deployment automation

## Monitoring and Observability

### Logging
- Structured logging with Morgan
- Error tracking and reporting
- Request/response logging
- Performance metrics

### Health Checks
- API health endpoints
- Database connectivity checks
- Service dependency monitoring
- Uptime tracking

## Future Considerations

### Semantic Search
- Vector embeddings for ideas
- Similarity scoring
- Machine learning integration
- Enhanced discovery

### Real-time Features
- WebSocket integration
- Live collaboration
- Real-time notifications
- Activity feeds

### Analytics
- User behavior tracking
- Idea popularity metrics
- Usage analytics
- A/B testing framework
