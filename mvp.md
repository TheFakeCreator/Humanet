YOU ARE: A developer assistant (Copilot) that must scaffold a production-minded, maintainable, modular TypeScript monorepo for the Humanet MVP.

GOAL: Create a monorepo that contains:
  - frontend/   -> Next.js (TypeScript, App Router), TailwindCSS, React Query
  - backend/    -> Node.js + Express (TypeScript, ES Modules), MongoDB with Mongoose
  - shared/     -> Shared TypeScript types/interfaces
  - scripts, CI, Docker, linting, tests, and developer tooling

GENERAL RULES (apply everywhere):
  - Use TypeScript everywhere. "strict": true.
  - Use components 
  - Use ES Modules (package.json "type": "module") for backend.
  - Keep files small: prefer <300 lines. Break functionality into services/controllers/utils.
  - Use async/await. No .then chains for primary flows.
  - Separate concerns: controllers -> services -> models -> routes. Controllers only handle req/res, services contain business logic, models only define DB schema.
  - Validate all external input with Zod (backend).
  - Use JWT for auth (access token + refresh token optional). Store JWT as HttpOnly cookie for frontend flows.
  - Use a shared `shared/src/types` for common types (Idea, User, Comment, DTOs).
  - Add ESLint + Prettier + Husky + lint-staged. Add sample unit tests.
  - Create Dockerfiles for frontend & backend and a docker-compose to run backend + frontend + MongoDB locally.

SCOPED MVP FEATURES (minimum working):
  - Auth: signup/login/logout using email + password (hashed with bcrypt).
  - Idea: create/read/list/search/fork (parentId link), upvote (one upvote per user).
  - Idea family tree endpoint: GET /ideas/:id/tree returns nested tree.
  - Comments on ideas.
  - Basic karma: upvotes increment user's karma; forks give attribution.
  - Simple frontend pages: landing, ideas list, idea detail (family tree preview), post idea form, login/signup, profile.

### UI & Components
- Place all reusable UI components inside `/frontend/src/components/`.  
- Do not duplicate components. Always reuse or extend existing ones.  
- Check `/components/` before creating a new component.  
- Use shadcn/ui and Tailwind as base building blocks.  
- Wrap shadcn components into custom components for consistent design.  
- Keep components modular and small. Break down large ones into smaller parts.  
- Variants should be handled via props, not duplication.  


STEP-BY-STEP TASKS (do them sequentially; commit per major step):

1) **Create monorepo root & workspaces**
   - Initialize repo root package.json with pnpm workspaces:
     ```
     {
       "name": "humanet",
       "private": true,
       "workspaces": ["frontend", "backend", "shared"],
       "scripts": {
         "dev": "concurrently \"pnpm --filter backend dev\" \"pnpm --filter frontend dev\"",
         "lint": "pnpm -w lint",
         "test": "pnpm -w test"
       }
     }
     ```
   - Add README.md with short project summary and local dev steps.

2) **Shared package**
   - `shared/package.json` with `"type": "module"`, build script if needed.
   - Create `shared/src/types/idea.ts`, `user.ts`, `comment.ts` with TypeScript interfaces:
     ```ts
     export interface UserDTO {
       _id?: string;
       username: string;
       email: string;
       bio?: string;
       karma?: number;
       skills?: string[];
     }
     export interface IdeaDTO {
       _id?: string;
       title: string;
       description: string;
       tags?: string[];
       domain?: string[];
       authorId: string;
       parentId?: string | null;
       upvotes?: number;
       createdAt?: string;
     }
     export interface CommentDTO {
       _id?: string;
       ideaId: string;
       authorId: string;
       text: string;
       createdAt?: string;
     }
     ```

3) **Backend scaffold**
   - `backend/package.json` (type: module) with scripts:
     - `dev` -> ts-node-dev to `src/server.ts`
     - `build` -> tsc
     - `start` -> node dist/server.js
   - `backend/tsconfig.json`:
     ```
     {
       "compilerOptions": {
         "target": "ES2022",
         "module": "NodeNext",
         "moduleResolution": "NodeNext",
         "outDir": "dist",
         "rootDir": "src",
         "strict": true,
         "esModuleInterop": true,
         "skipLibCheck": true,
         "resolveJsonModule": true,
         "baseUrl": "./",
         "paths": {
           "@shared/*": ["../shared/src/*"]
         }
       },
       "include": ["src"]
     }
     ```
   - Create `backend/src/config/index.ts` to read environment variables using dotenv and zod.
   - Create `backend/src/app.ts` that configures express middlewares:
     - helmet, cors (allow frontend origin with credentials), express.json, cookie-parser, morgan (dev).
   - Create `backend/src/server.ts` to connect to MongoDB and start server (graceful shutdown).
   - Create `backend/src/models/` with Mongoose schemas in TS:
     - `user.model.ts` (username, email, passwordHash, bio, skills[], karma(Number), createdAt)
     - `idea.model.ts` (title, description, tags[], domain[], author(ObjectId), parentId(ObjectId|null), upvotes(Number default 0), upvoters [ObjectId], forkCount)
     - `comment.model.ts`
   - Ensure `idea.model` has a `text index` on title + description for search: `IdeaSchema.index({ title: 'text', description: 'text', tags: 'text' });`
   - Create `backend/src/types` as needed for internal types.

4) **Backend layers: controllers/services/routes**
   - For each resource (auth, users, ideas, comments) build:
     - `services/<resource>.service.ts` with database logic
     - `controllers/<resource>.controller.ts` that calls services and returns responses
     - `routes/<resource>.routes.ts` that registers routes on an Express Router
   - Implement DTOs & validators using Zod:
     - `validation/createIdea.schema.ts` etc.
   - Implement `auth.middleware.ts` that extracts JWT from HttpOnly cookie or Authorization header; verifies JWT and attaches user to req.
   - Implement `error.middleware.ts` for centralized error handling (custom AppError class).

5) **Auth**
   - Implement `/api/auth/signup` (validate, hash password with bcrypt, create user).
   - Implement `/api/auth/login` (verify password, sign JWT, set HttpOnly cookie).
   - Implement `/api/auth/me` (protected, return user profile).
   - JWT: sign with process.env.JWT_SECRET, expiresIn short (e.g., 15m) for access. Optionally implement refresh token later.

6) **Ideas API**
   - Endpoints:
     - `POST /api/ideas` -> create idea (validate with Zod, require auth)
     - `GET /api/ideas` -> list ideas with optional `search`, `domain`, `tags`, `page`, `limit`
     - `GET /api/ideas/:id` -> get idea detail (populate author)
     - `GET /api/ideas/:id/tree` -> return nested family tree (limit depth, use recursion or aggregation)
     - `POST /api/ideas/:id/fork` -> create new idea with parentId set to :id; increment parent forkCount; attribute original author (store relation)
     - `POST /api/ideas/:id/upvote` -> toggle upvote: update upvoters set, increment/decrement upvotes; increment author's karma when upvote occurs
   - Use mongoose transactions for multi-step operations (fork increments + create child + attribution).

7) **Comments API**
   - `POST /api/ideas/:id/comments`
   - `GET /api/ideas/:id/comments`

8) **Family tree implementation notes**
   - Store parentId on idea (single parent). Child ideas are those with parentId === parent._id. For tree endpoint:
     - Use a recursive query (server-side) or an aggregation that builds children array.
     - Limit recursion depth (configurable).
   - For faster lookup, consider materialized path (string of ancestor ids) in future, but for MVP recursion is fine.

9) **Search**
   - Implement text search using MongoDB text index:
     - Query: `{ $text: { $search: keyword } }` with `score: { $meta: "textScore" }` and sort by score.
     - For fuzzy / semantic later, design API to accept `useSemantic=true` flag.

10) **Karma rules (simple MVP)**
    - Upvote increases idea.upvotes and author.karma += 1.
    - Fork creation gives original author karma +2 and increases forkCount.
    - Ensure upvote is idempotent per user: keep `upvoters: ObjectId[]`.

11) **Backend tests**
    - Setup Jest + ts-jest + Supertest.
    - Add integration test for auth, create idea, fork idea, tree endpoint. Mock or use test MongoDB (in-memory mongodb-memory-server).

12) **Frontend scaffold (Next.js, App Router)**
    - `frontend/package.json` scripts: `dev`, `build`, `start`, `lint`, `test`.
    - Use `pnpm` install; use `next@latest`, `react`, `react-dom`, `tailwindcss`, `@tanstack/react-query`, `axios`.
    - Setup Tailwind per Next.js docs (globals in app/globals.css).
    - Create `frontend/src/app/layout.tsx` with React Query provider and global layout (header with nav).
    - Create simple pages:
      - `app/page.tsx` -> Landing with CTA and latest ideas list (fetch via React Query).
      - `app/ideas/page.tsx` -> Ideas list with search input, filters, pagination.
      - `app/ideas/[id]/page.tsx` -> Idea detail page: shows idea content, family-tree preview, comments, fork button, upvote button.
      - `app/auth/login/page.tsx` & `app/auth/signup/page.tsx`
      - `app/profile/[username]/page.tsx`
    - Implement `frontend/src/lib/api.ts` axios client:
      - baseURL = process.env.NEXT_PUBLIC_API_URL
      - withCredentials = true
    - Implement React Query hooks in `frontend/src/hooks/`:
      - `useIdeas`, `useIdea`, `useCreateIdea`, `useForkIdea`, `useUpvoteIdea`, `useComments`
    - Implement small UI components:
      - `IdeaCard.tsx`, `IdeaForm.tsx`, `CommentList.tsx`, `FamilyTreePreview.tsx` (simple tree rendering using recursion)

13) **Frontend auth flow**
    - After login, backend returns HttpOnly cookie and user payload (or /auth/me fetch).
    - For protected UI actions, check `auth/me` and show login if not authenticated.
    - Keep JWT handling server-side (HttpOnly cookie) to avoid XSS risks.

14) **Shared types usage**
    - Import DTO types from `shared` in both frontend and backend to keep contract stable.
    - Example import path via tsconfig paths alias `@shared/*`.

15) **Linting, formatting, commit hooks**
    - Root config files:
      - `.eslintrc.cjs` configured for workspace: set base rules for both frontend and backend and plugin:@typescript-eslint.
      - `.prettierrc` standard rules.
    - Install Husky and lint-staged: pre-commit run `pnpm -w lint-staged` which will run formatting + tests on changed files.

16) **CI**
    - Add `.github/workflows/ci.yml` to:
      - Install pnpm, run `pnpm -w install`.
      - Run `pnpm -w lint`, `pnpm -w test`, `pnpm -w build` (build frontend & backend).
      - Cache pnpm store.

17) **Docker**
    - Add `backend/Dockerfile` (node:18-alpine -> build -> dist -> node run).
    - Add `frontend/Dockerfile` (node build -> serve).
    - Add `docker-compose.yml` for local environment with services:
      - mongo: official mongo image with volume
      - backend: build from backend Dockerfile, depends_on: mongo
      - frontend: build from frontend Dockerfile, depends_on: backend

18) **Documentation**
    - Add `docs/ARCHITECTURE.md` explaining layers and decisions.
    - Add `docs/DEV_SETUP.md` with step-by-step local dev instructions (env variables list).
    - Add API contract summary at `docs/API.md` (routes and payloads).

19) **Quality gates & best practices**
    - Ensure every new route has:
      - Zod schema for inputs
      - Unit tests for service logic
      - Integration test for route in backend tests
    - Keep functions < 50 lines where possible; files < 300 lines.
    - Use index barrel files only when appropriate; avoid deep barrel import confusion.

20) **Post-scaffold tasks (future)**
    - Add GitHub OAuth login (optional).
    - Implement semantic search (embeddings + pgvector or dedicated vector DB).
    - Implement merge proposals for duplicates & attribution history.
    - Add analytics and admin moderation tools.

FILES & EXAMPLES (create these exact files as part of scaffolding — make them runnable):

- `backend/src/server.ts`:
```ts
import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
const app = createApp();

const MONGO = process.env.MONGO_URL!;
mongoose.set('strictQuery', true);
await mongoose.connect(MONGO);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
```
- backend/src/app.ts:
  
```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', true);
  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api', routes);
  app.use(errorHandler);
  return app;
}
```

- backend/src/models/idea.model.ts:
```ts
import { Schema, model } from 'mongoose';

const IdeaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  domain: { type: [String], default: [] },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Idea', default: null },
  upvotes: { type: Number, default: 0 },
  upvoters: { type: [Schema.Types.ObjectId], default: [] },
  forkCount: { type: Number, default: 0 }
}, { timestamps: true });

IdeaSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const IdeaModel = model('Idea', IdeaSchema);
```

- frontend/src/lib/api.ts:
```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  withCredentials: true
});

export default api;
```

- frontend/src/app/layout.tsx (Next.js app router skeleton):
```tsx
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <header>{/* nav */}</header>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

IMPORTANT: After scaffolding, run pnpm -w install and pnpm dev from root. Ensure env files:

backend/.env: MONGO_URL, JWT_SECRET, FRONTEND_URL, PORT

frontend/.env.local: NEXT_PUBLIC_API_URL

FINAL NOTES FOR YOU (the developer):

Ask the assistant (Copilot) to create a series of commits (one per major step) instead of one giant change. This makes reviews easy.

Verify the backend server boots and POST /api/auth/signup and POST /api/ideas work end-to-end before building UI pages.

Keep the shared types contract stable. Use these types on both ends.

Prioritize the core flows (auth → create idea → fork idea → tree endpoint) before styling.

Now: scaffold the repo exactly following steps 1–20. Create files and configs shown above. For any file you create, ensure it is TypeScript, strictly typed, and small; create unit tests for each service. Ask for follow-up to implement semantic search or enterprise features.