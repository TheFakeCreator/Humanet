# Development Guide

This guide covers everything you need to know to contribute to Humanet effectively.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Coding Standards](#coding-standards)
4. [Database Design](#database-design)
5. [API Development](#api-development)
6. [Frontend Development](#frontend-development)
7. [Testing](#testing)
8. [Debugging](#debugging)
9. [Performance](#performance)
10. [Deployment](#deployment)

## Getting Started

### Prerequisites
- **Node.js** 18+ with npm/pnpm
- **MongoDB** 5.0+ (local or Atlas)
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - MongoDB for VS Code

### Initial Setup
```bash
# Clone repository
git clone https://github.com/TheFakeCreator/Humanet.git
cd Humanet

# Install dependencies
pnpm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start development servers
pnpm dev
```

### Development Workflow
1. Create feature branch from `main`
2. Make changes following coding standards
3. Write/update tests
4. Run linting and tests
5. Commit with conventional commit format
6. Push and create pull request

## Project Architecture

### Monorepo Structure
```
Humanet/
├── backend/         # Node.js API (Express + TypeScript)
├── frontend/        # Next.js App (React + TypeScript)
├── shared/          # Shared TypeScript types
└── docs/           # Documentation
```

### Backend Architecture
```
backend/src/
├── controllers/    # HTTP request handlers
├── services/       # Business logic layer
├── models/         # Mongoose schemas
├── routes/         # Express route definitions
├── middlewares/    # Custom middleware
├── validation/     # Zod validation schemas
├── config/         # Configuration files
├── utils/          # Helper functions
└── tests/          # Test suites
```

**Layered Architecture:**
```
┌─────────────────┐
│   Controllers   │ ← HTTP layer (req/res handling)
└─────────────────┘
         │
┌─────────────────┐
│    Services     │ ← Business logic layer
└─────────────────┘
         │
┌─────────────────┐
│     Models      │ ← Data access layer
└─────────────────┘
```

### Frontend Architecture
```
frontend/src/
├── app/            # Next.js App Router
│   ├── (auth)/     # Auth pages group
│   ├── ideas/      # Ideas pages
│   └── users/      # User pages
├── components/     # Reusable components
│   ├── ui/         # UI components
│   └── forms/      # Form components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and config
└── types/          # Frontend-specific types
```

## Coding Standards

### TypeScript Configuration
- **Strict mode**: All projects use `strict: true`
- **ES Modules**: Backend uses `"type": "module"`
- **Path mapping**: Use `@/` for absolute imports

### Naming Conventions
```typescript
// Variables and functions - camelCase
const userName = 'john';
const getUserById = (id: string) => {};

// Classes and types - PascalCase
class UserService {}
interface UserDTO {}
type ApiResponse<T> = {};

// Constants - UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5242880;

// Files - kebab-case
user-service.ts
idea-card.tsx
auth-middleware.ts
```

### Code Organization

**Services Pattern:**
```typescript
// ❌ Don't put business logic in controllers
export const createIdea = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new Error('User not found');
  
  const idea = new Idea({
    title: req.body.title,
    description: req.body.description,
    authorId: user._id
  });
  
  await idea.save();
  
  // Update user karma...
  // Send notifications...
  // Log activity...
  
  res.json({ success: true, data: { idea } });
};

// ✅ Do separate concerns
export const createIdea = async (req: Request, res: Response) => {
  try {
    const ideaData = createIdeaSchema.parse(req.body);
    const idea = await IdeaService.createIdea(req.user.id, ideaData);
    
    res.status(201).json({
      success: true,
      data: { idea }
    });
  } catch (error) {
    next(error);
  }
};
```

**Component Patterns:**
```tsx
// ✅ Good component structure
interface IdeaCardProps {
  idea: IdeaDTO;
  onVote?: (ideaId: string) => void;
  onFork?: (ideaId: string) => void;
}

export function IdeaCard({ idea, onVote, onFork }: IdeaCardProps) {
  // Hooks first
  const { data: user } = useAuth();
  const upvoteMutation = useUpvoteIdea();
  
  // Event handlers
  const handleVote = useCallback(() => {
    onVote?.(idea._id!);
  }, [idea._id, onVote]);
  
  // Render logic
  return (
    <div className="idea-card">
      {/* Component content */}
    </div>
  );
}
```

### Error Handling

**Backend Error Handling:**
```typescript
// Use custom error classes
export class ValidationError extends Error {
  constructor(message: string, public details?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Centralized error middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR',
        details: error.details
      }
    });
  }
  
  // Handle other error types...
};
```

**Frontend Error Handling:**
```tsx
// Use error boundaries and proper error states
export function IdeaList() {
  const { data, isLoading, error } = useIdeas();
  
  if (isLoading) return <LoadingSkeleton />;
  
  if (error) {
    return (
      <ErrorMessage 
        title="Failed to load ideas"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }
  
  return <div>{/* Success state */}</div>;
}
```

## Database Design

### MongoDB Collections

**Users Collection:**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  bio: String,
  skills: [String],
  karma: Number,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ email: 1 } // unique
{ username: 1 } // unique
{ karma: -1 } // for leaderboards
```

**Ideas Collection:**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  tags: [String],
  domain: [String],
  authorId: ObjectId,
  parentId: ObjectId, // for forks
  upvotes: Number,
  upvoters: [ObjectId], // users who upvoted
  forkCount: Number,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ authorId: 1, createdAt: -1 }
{ parentId: 1 } // for family trees
{ tags: 1 }
{ domain: 1 }
{ upvotes: -1, createdAt: -1 } // for popular sorting
{ "upvoters": 1 } // for upvote checking
```

**Comments Collection:**
```javascript
{
  _id: ObjectId,
  text: String,
  authorId: ObjectId,
  ideaId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ ideaId: 1, createdAt: -1 }
{ authorId: 1, createdAt: -1 }
```

### Aggregation Pipelines

**Idea Family Tree:**
```javascript
// Get complete family tree
const pipeline = [
  { $match: { _id: rootIdeaId } },
  {
    $graphLookup: {
      from: 'ideas',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'parentId',
      as: 'descendants',
      maxDepth: 10
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author'
    }
  }
];
```

## API Development

### Request/Response Patterns

**Standard Response Format:**
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

**Validation with Zod:**
```typescript
// Define schema
export const createIdeaSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  tags: z.array(z.string()).max(10).optional(),
  domain: z.array(z.string()).optional()
});

// Use in middleware
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.flatten().fieldErrors
          }
        });
      }
      next(error);
    }
  };
};
```

### Authentication Middleware

```typescript
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
    }
    
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      }
    });
  }
};
```

## Frontend Development

### React Query Patterns

```typescript
// Custom hooks for API calls
export const useIdeas = (params: IdeaSearchParams = {}) => {
  return useQuery({
    queryKey: ['ideas', params],
    queryFn: () => ideasApi.getIdeas(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ideasApi.createIdea,
    onSuccess: (newIdea) => {
      // Invalidate and refetch ideas list
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      
      // Optimistically update cache
      queryClient.setQueryData(['ideas', newIdea._id], newIdea);
    },
    onError: (error) => {
      // Handle error (toast notification, etc.)
      console.error('Failed to create idea:', error);
    }
  });
};
```

### Component Composition

```tsx
// Composition over inheritance
export function IdeaPage({ ideaId }: { ideaId: string }) {
  return (
    <PageLayout>
      <IdeaHeader ideaId={ideaId} />
      <IdeaContent ideaId={ideaId} />
      <IdeaSidebar ideaId={ideaId} />
    </PageLayout>
  );
}

// Compound components
export function IdeaCard({ idea }: { idea: IdeaDTO }) {
  return (
    <Card>
      <IdeaCard.Header idea={idea} />
      <IdeaCard.Content idea={idea} />
      <IdeaCard.Actions idea={idea} />
    </Card>
  );
}

IdeaCard.Header = ({ idea }: { idea: IdeaDTO }) => (
  <CardHeader>
    <h3>{idea.title}</h3>
    <AuthorInfo author={idea.author} />
  </CardHeader>
);
```

### State Management

```typescript
// Use React Query for server state
// Use React Context for global UI state
interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
```

## Testing

### Backend Testing with Jest

```typescript
// Test setup
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Test example
describe('POST /api/ideas', () => {
  it('should create a new idea', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    // Create user and get token
    const authResponse = await request(app)
      .post('/api/auth/signup')
      .send(userData);
    
    const token = authResponse.body.data.token;
    
    // Create idea
    const ideaData = {
      title: 'Test Idea',
      description: 'This is a test idea'
    };
    
    const response = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${token}`)
      .send(ideaData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.idea.title).toBe(ideaData.title);
  });
});
```

### Frontend Testing

```tsx
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IdeaCard } from './IdeaCard';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('IdeaCard', () => {
  const mockIdea = {
    _id: '1',
    title: 'Test Idea',
    description: 'Test description',
    author: { _id: '1', username: 'testuser', karma: 100 },
    upvotes: 5,
    forkCount: 2
  };
  
  it('renders idea information correctly', () => {
    renderWithProviders(<IdeaCard idea={mockIdea} />);
    
    expect(screen.getByText('Test Idea')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
});
```

## Debugging

### Backend Debugging

```typescript
// Use debug module for logging
import debug from 'debug';

const log = debug('humanet:api');
const dbLog = debug('humanet:db');

// In services
export class IdeaService {
  static async createIdea(authorId: string, data: CreateIdeaDTO) {
    log('Creating idea for user %s', authorId);
    dbLog('Idea data: %O', data);
    
    try {
      const idea = await IdeaModel.create({
        ...data,
        authorId
      });
      
      log('Created idea %s', idea._id);
      return idea;
    } catch (error) {
      log('Failed to create idea: %O', error);
      throw error;
    }
  }
}
```

**VS Code Launch Configuration:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "humanet:*"
      },
      "runtimeArgs": ["--loader", "ts-node/esm"],
      "resolveSourceMapLocations": ["${workspaceFolder}/**"]
    }
  ]
}
```

### Frontend Debugging

```tsx
// React Developer Tools
// React Query Developer Tools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Performance

### Backend Performance

```typescript
// Database optimization
// 1. Use indexes effectively
await IdeaModel.createIndex({ authorId: 1, createdAt: -1 });
await IdeaModel.createIndex({ tags: 1 });
await IdeaModel.createIndex({ upvotes: -1, createdAt: -1 });

// 2. Use aggregation for complex queries
const popularIdeas = await IdeaModel.aggregate([
  { $match: { createdAt: { $gte: lastWeek } } },
  { $sort: { upvotes: -1, createdAt: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author'
    }
  }
]);

// 3. Implement caching for expensive operations
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export const getCachedIdeaTree = async (ideaId: string) => {
  const cacheKey = `idea-tree:${ideaId}`;
  let tree = cache.get(cacheKey);
  
  if (!tree) {
    tree = await IdeaService.getIdeaTree(ideaId);
    cache.set(cacheKey, tree);
  }
  
  return tree;
};
```

### Frontend Performance

```tsx
// 1. Code splitting with dynamic imports
const IdeaDetails = lazy(() => import('./components/IdeaDetails'));

// 2. Memoization
const IdeaList = memo(({ ideas }: { ideas: IdeaDTO[] }) => {
  return (
    <div>
      {ideas.map(idea => (
        <IdeaCard key={idea._id} idea={idea} />
      ))}
    </div>
  );
});

// 3. Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedIdeaList = ({ ideas }: { ideas: IdeaDTO[] }) => (
  <List
    height={600}
    itemCount={ideas.length}
    itemSize={200}
    itemData={ideas}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <IdeaCard idea={data[index]} />
      </div>
    )}
  </List>
);

// 4. Optimistic updates
const useOptimisticUpvote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: upvoteIdea,
    onMutate: async (ideaId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['ideas', ideaId]);
      
      // Snapshot previous value
      const previousIdea = queryClient.getQueryData(['ideas', ideaId]);
      
      // Optimistically update
      queryClient.setQueryData(['ideas', ideaId], (old: IdeaDTO) => ({
        ...old,
        upvotes: old.upvotes + 1
      }));
      
      return { previousIdea };
    },
    onError: (err, ideaId, context) => {
      // Rollback on error
      queryClient.setQueryData(['ideas', ideaId], context.previousIdea);
    }
  });
};
```

## Deployment

### Environment Configuration

```typescript
// config/index.ts
export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  
  DATABASE: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/humanet',
    OPTIONS: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  JWT: {
    SECRET: process.env.JWT_SECRET!,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
  },
  
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}
```

### Production Optimizations

```typescript
// Enable gzip compression
import compression from 'compression';
app.use(compression());

// Security headers
import helmet from 'helmet';
app.use(helmet());

// Request logging
import morgan from 'morgan';
app.use(morgan('combined'));

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});
```

### Health Checks

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

This development guide provides comprehensive information for contributors to understand and work effectively with the Humanet codebase. It covers architecture, coding standards, testing, debugging, and deployment considerations.
