## 🏗️ General Project Structure

- This is a **monorepo** with two main folders:
  - `frontend/` → Next.js (React + Vite can be used for smaller projects, but Next.js is chosen for scalability, SSR/SSG, routing, and SEO).
  - `backend/` → Node.js + Express + MongoDB, fully in **TypeScript**, with ES Modules (`"type": "module"`).
- All code must be **modular**, **maintainable**, and **scalable**.
- Avoid single files longer than **300 lines**; break them into smaller modules.

---

## 🎯 General Coding Guidelines

1. **Use TypeScript everywhere** (`.ts` / `.tsx`).
2. Enforce **strict typing** (`strict: true` in `tsconfig.json`).
3. Follow **SOLID principles** and **separation of concerns**.
4. Code must be **linted** with ESLint + Prettier + Husky pre-commit hooks.
5. Always prefer **async/await** over callbacks or `.then()`.
6. Follow **RESTful API design** and proper **HTTP status codes**.
7. Use **environment variables** (never hardcode secrets, keys, or DB URLs).
8. Every module must have **clear responsibilities** and no "god files".
9. Always write **meaningful commit messages** using **Conventional Commits** style:
   - `feat: add idea submission feature`
   - `fix: resolve MongoDB connection issue`
   - `refactor: split routes into separate files`

10. **Always implement loading states** for user interactions (buttons, forms, page transitions).

11. **Use comprehensive error handling** with user-friendly error messages and toast notifications.

12. **Implement proper validation** on both client and server sides with clear error messages.

13. **🗺️ CRITICAL: Always maintain the ROADMAP.md file** - When implementing features, completing tasks, or making significant changes, update the roadmap to reflect current progress and adjust priorities as needed.

14. **🤝 IMPLEMENTATION APPROVAL REQUIRED** - Before implementing any new feature, service, or significant code change, ALWAYS:
    - Explain the implementation approach and architecture
    - Describe the technical decisions and trade-offs
    - Get explicit user approval before proceeding with code changes
    - Ask for feedback on the proposed solution

---

## 📋 Roadmap Management Guidelines

### **When to Update ROADMAP.md:**

1. **Feature Completion**: Mark items as completed with ✅ and brief description
2. **New Feature Implementation**: Add new features to appropriate phases
3. **Priority Changes**: Adjust immediate/medium/long-term priorities based on development needs
4. **Status Updates**: Update "Current Development Status" section regularly
5. **Timeline Adjustments**: Modify phase timelines when scope or complexity changes

### **Roadmap Update Pattern:**

```markdown
- [x] **Feature Name** (Brief implementation details) ✅
- [ ] **In Progress Feature** (Current status/blockers) 🚧
- [ ] **Planned Feature** (Dependencies/requirements)
```

### **Required Roadmap Sections to Maintain:**

- **Current Development Status**: Update monthly or after major milestones
- **Implementation Timeline & Priorities**: Adjust based on completed work
- **Phase Progress**: Mark completed items and update phase status
- **Next Priority Items**: Keep this aligned with current development focus

### **Roadmap Review Triggers:**

- After completing any major feature
- When starting a new development sprint/phase
- When dependencies or technical requirements change
- When adjusting project scope or timeline
- During monthly project reviews

---

## 🖥️ Frontend (Next.js + React + TypeScript)

- Framework: **Next.js (with App Router)** for scalability.
- Styling: **TailwindCSS** + **shadcn/ui** for components.

- **shadcn/ui Standards:**
  - Use "new-york" style with CSS variables
  - **Lucide icons** for all iconography
  - Components in `@/components/ui/` directory
  - Always use provided variants and sizes
  - Extend components by composition, not modification
  - Use `cn()` utility for conditional classes

- **NEVER use mock/dummy data** - Always fetch real data from API endpoints using React Query hooks.
- State Management: **React Query (TanStack)** for server data + Context API/Zustand for global UI state.
- API requests via a **typed Axios client** with interceptors.

- **UI/UX Standards:**
  - Always implement loading states using our enhanced Button component with `loading` prop
  - Use toast notifications for user feedback (success/error messages)
  - Implement proper form validation with real-time feedback
  - Use skeleton loaders while content is loading
  - Ensure all interactive elements provide immediate visual feedback
- Directory structure:
  `frontend/   src/     app/              # Next.js App Router (routes, pages, layouts)     components/       # Reusable UI components     features/         # Feature-specific components (e.g., ideas, users)     hooks/            # Custom React hooks     lib/              # API clients, utils, config     store/            # State management (Zustand/Context)     types/            # Global TypeScript interfaces`
- **Best Practices**:
  - Use **functional components** only.
  - Each component ≤ 150 lines.
  - Always use `props` interfaces with TypeScript.
  - Write **utility functions** separately in `lib/` instead of inside components.
  - Favor **composition over inheritance**.
  - Use **lazy loading / code splitting** for heavy components.

  - **Loading States**: Always use the enhanced Button component for forms:
    ```tsx
    <Button loading={mutation.isPending} loadingText="Processing..." disabled={!isValid}>
      Submit
    </Button>
    ```
  - **Error Handling**: Use toast notifications for all user feedback:
    ```tsx
    toast({
      title: 'Success!',
      description: 'Operation completed successfully',
    });
    ```

---

## ⚙️ Backend (Node.js + Express + MongoDB + TypeScript)

- Framework: **Express** with TypeScript + ES Modules.
- Database: **MongoDB with Mongoose**.
- Directory structure:
  `backend/   src/     config/           # Database config, environment setup     models/           # Mongoose models     controllers/      # Request handlers     routes/           # Express routes     services/         # Business logic (separate from controllers)     middlewares/      # Auth, error handling, validation     utils/            # Helper functions     types/            # TypeScript interfaces/types     app.ts            # Express app setup     server.ts         # Server bootstrap`
- **Best Practices**:
  - Use **DTOs (Data Transfer Objects)** for request/response typing.
  - Always validate input with **Zod** schemas - follow existing patterns in `validation/` folder.
  - Use **async error handling middleware** (no `try/catch` in every controller).
  - **Error handling**: Use AppError class for operational errors:
    ```typescript
    throw new AppError('Resource not found', 404);
    ```
  - Separate:
    - **Controller** → Handles req/res, delegates to services
    - **Service** → Business logic, data processing
    - **Model** → Database schema and validations
  - Use **index.ts barrels** in folders for cleaner imports.
  - Never mix DB queries directly in controllers.

  - **Validation patterns**: Always clean and validate data:
    ```typescript
    // Clean undefined arrays before sending
    const cleanData = {
      title: data.title.trim(),
      tags: data.tags?.length > 0 ? data.tags : undefined,
    };
    ```

---

## 🛡️ Security & Authentication

- Use **JWT** authentication (with refresh tokens).
- Hash passwords with **bcrypt**.
- Sanitize inputs against **NoSQL Injection** and **XSS**.
- Use **Helmet.js** and **CORS** properly configured.

---

## 📊 Database Schema Guidelines

- Use **plural collection names** (`users`, `ideas`, `projects`).
- Keep schema definitions **clean and modular**.
- Example for `Idea`:
  `interface Idea {   title: string;   description: string;   domain: string[];   createdBy: ObjectId;   upvotes: number;   createdAt: Date;   updatedAt: Date; }`

---

## 🧪 Testing

- Use **Jest** + **Supertest** for backend.
- Use **React Testing Library** for frontend.
- Always write unit tests for utils/services and integration tests for routes.

---

## 🛠️ DevOps & Tooling

- Package manager: **pnpm** (monorepo friendly).
- Use **Docker** for containerization.
- Add **GitHub Actions CI/CD** with lint + test on every PR.
- Add **commit hooks** (Husky + lint-staged).

- **Development Scripts**:
  - `pnpm dev` - Start both frontend and backend in development
  - `pnpm build` - Build both packages for production
  - `pnpm seed` - Seed database with sample data
  - `pnpm db:migrate` - Run database migrations
  - `pnpm lint` - Run ESLint across all packages
  - `pnpm test` - Run all tests

- **Workspace Structure**:
  - Root level scripts handle cross-package commands
  - Use `--filter` flag to target specific packages
  - Shared dependencies managed at workspace root

---

## 🎨 Code Style & Formatting

- **Prettier Configuration**:
  - Semi-colons: `true`
  - Single quotes: `true`
  - Print width: `100`
  - Tab width: `2` spaces
  - Trailing commas: `es5`

- **ESLint Rules**:
  - Unused vars: `error` (except args starting with `_`)
  - `any` type: `warn` (minimize usage)
  - No explicit return types required for functions
  - Non-null assertions: `warn`

- **Naming conventions**:
  - Variables & functions → `camelCase`
  - Classes & types → `PascalCase`
  - Constants → `UPPER_SNAKE_CASE`
- **File naming**: `kebab-case.ts` for files.
- **Folder naming**: lowercase (e.g., `controllers`, `models`).

---

## 🔄 Shared Package Patterns

- **Shared types** in `shared/src/types/` with `.js` extension imports for compatibility
- **Barrel exports** in `shared/src/index.ts` for clean imports
- **Consistent DTOs** across frontend and backend
- **API response types** standardized with `ApiResponse<T>` and `PaginatedResponse<T>`

---

## 🚨 Error Handling Standards

- **Backend**: Use `AppError` class for operational errors with appropriate status codes
- **Frontend**: Always use toast notifications for user feedback
- **Validation**: Client-side validation + server-side Zod schemas
- **Loading states**: Never leave users without feedback during async operations
- **Form handling**: Validate, show loading, handle errors, show success

---

## 📏 Code Style

---

## 🌐 API Design Patterns

- **Consistent Response Format**:

  ```typescript
  // Success responses
  {
    "success": true,
    "data": { /* response data */ },
    "message": "Operation successful"
  }

  // Error responses
  {
    "success": false,
    "error": "Error message",
    "message": "User-friendly message",
    "statusCode": 400
  }
  ```

- **Pagination Standard**:

  ```typescript
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
  ```

- **API Client Configuration**:
  - Use axios with interceptors for auth and error handling
  - Base URL from environment variables
  - Credentials included for cookie-based auth
  - Consistent error response handling

---

## 🚀 Long-term Scalability & Consistency Guidelines

### **🏗️ Architecture Principles**

- **Modular Monolith**: Keep related features together, clear module boundaries
- **Domain-Driven Design**: Organize code by business domains (users, ideas, comments)
- **API-First**: Design APIs before implementation, maintain OpenAPI specs
- **Database-First**: Plan schema changes, use migrations, maintain data integrity

### **📦 Component Architecture**

- **Atomic Design**: Atoms (Button) → Molecules (SearchForm) → Organisms (Header) → Templates → Pages
- **Composition over Inheritance**: Build complex components from simpler ones
- **Props Interface Standards**: Always define and export prop types
- **Consistent Naming**: `<FeatureName><ComponentType>` (e.g., `IdeaCard`, `UserProfile`)

### **🎯 Feature Development Standards**

- **Feature Flags**: Use environment-based feature toggles for gradual rollouts
- **Progressive Enhancement**: Core functionality first, enhancements second
- **Mobile-First**: Design for mobile, enhance for desktop
- **Accessibility-First**: WCAG 2.1 AA compliance from day one

### **⚡ Performance & Optimization**

- **Code Splitting**: Lazy load routes and heavy components
- **Image Optimization**: Use Next.js Image component, WebP format
- **Bundle Analysis**: Regular bundle size monitoring and optimization
- **Database Indexing**: Index frequently queried fields
- **Caching Strategy**: Redis for sessions, API response caching

### **🔒 Security Standards**

- **Input Validation**: Client + Server validation on ALL inputs
- **Rate Limiting**: API endpoint protection against abuse
- **CSRF Protection**: Token-based protection for state-changing operations
- **SQL/NoSQL Injection Prevention**: Parameterized queries, input sanitization
- **Dependency Updates**: Regular security audit and updates

### **📊 Monitoring & Observability**

- **Error Tracking**: Structured error logging with context
- **Performance Monitoring**: API response times, database query performance
- **User Analytics**: Track feature usage for data-driven decisions
- **Health Checks**: Automated monitoring of critical services

### **🔄 Development Workflow Standards**

- **Branch Strategy**: `feature/*`, `fix/*`, `release/*` naming
- **PR Requirements**: Tests passing, code review, documentation updates
- **Deployment Pipeline**: Staging → Production with automated testing
- **Database Migrations**: Reversible, tested migrations only
- **Roadmap Maintenance**: Update ROADMAP.md after every significant milestone

### **📚 Documentation Standards**

- **API Documentation**: Auto-generated from code (OpenAPI/Swagger)
- **Component Documentation**: Storybook for UI components
- **Architecture Decision Records**: Document major technical decisions
- **Changelog**: Semantic versioning with detailed change logs
- **Roadmap Updates**: Keep ROADMAP.md current with development progress

### **🎨 Design System Standards**

- **Design Tokens**: Centralized colors, typography, spacing
- **Component Library**: Maintain shadcn/ui customizations in dedicated files
- **Responsive Breakpoints**: Consistent across all components
- **Dark/Light Mode**: Built-in theme switching capability
- **Internationalization**: i18n ready architecture from start

---

## ✅ Example Workflow for Copilot

1. When creating a new API route:
   - First create a **TypeScript interface** in `types/`.
   - Add a **Mongoose model** in `models/`.
   - Add a **service function** in `services/`.
   - Add a **controller** that uses the service.
   - Register it in `routes/`.
   - Write a **test** for it.
   - **Update ROADMAP.md** if this completes a planned feature.

2. For new frontend features:
   - Create a `feature/` folder with related components.
   - Add TypeScript types in `types/`.
   - Connect API via React Query hook in `hooks/`.
   - Build components with Tailwind + shadcn/ui.
   - Ensure accessibility (a11y).
   - **Update ROADMAP.md** to reflect feature completion and adjust priorities.

3. When completing major milestones:
   - Mark completed features in ROADMAP.md with ✅
   - Update "Current Development Status" section
   - Adjust next priorities based on completed work
   - Update timeline estimates if needed
   - Add new features or technical debt items as discovered
