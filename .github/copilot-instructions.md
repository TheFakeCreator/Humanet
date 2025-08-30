<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

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
        

---

## 🖥️ Frontend (Next.js + React + TypeScript)

- Framework: **Next.js (with App Router)** for scalability.
    
- Styling: **TailwindCSS** + shadcn/ui for components.
    
- State Management: **React Query (TanStack)** for server data + Context API/Zustand for global UI state.
    
- API requests via a **typed Axios client** with interceptors.
    
- Directory structure:
    
    `frontend/   src/     app/              # Next.js App Router (routes, pages, layouts)     components/       # Reusable UI components     features/         # Feature-specific components (e.g., ideas, users)     hooks/            # Custom React hooks     lib/              # API clients, utils, config     store/            # State management (Zustand/Context)     types/            # Global TypeScript interfaces`
    
- **Best Practices**:
    
    - Use **functional components** only.
        
    - Each component ≤ 150 lines.
        
    - Always use `props` interfaces with TypeScript.
        
    - Write **utility functions** separately in `lib/` instead of inside components.
        
    - Favor **composition over inheritance**.
        
    - Use **lazy loading / code splitting** for heavy components.
        

---

## ⚙️ Backend (Node.js + Express + MongoDB + TypeScript)

- Framework: **Express** with TypeScript + ES Modules.
    
- Database: **MongoDB with Mongoose**.
    
- Directory structure:
    
    `backend/   src/     config/           # Database config, environment setup     models/           # Mongoose models     controllers/      # Request handlers     routes/           # Express routes     services/         # Business logic (separate from controllers)     middlewares/      # Auth, error handling, validation     utils/            # Helper functions     types/            # TypeScript interfaces/types     app.ts            # Express app setup     server.ts         # Server bootstrap`
    
- **Best Practices**:
    
    - Use **DTOs (Data Transfer Objects)** for request/response typing.
        
    - Always validate input with **Zod** or **Joi**.
        
    - Use **async error handling middleware** (no `try/catch` in every controller).
        
    - Separate:
        
        - **Controller** → Handles req/res
            
        - **Service** → Business logic
            
        - **Model** → Database schema
            
    - Use **index.ts barrels** in folders for cleaner imports.
        
    - Never mix DB queries directly in controllers.
        

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
    

---

## 📏 Code Style

- **Naming conventions**:
    
    - Variables & functions → `camelCase`
        
    - Classes & types → `PascalCase`
        
    - Constants → `UPPER_SNAKE_CASE`
        
- **File naming**: `kebab-case.ts` for files.
    
- **Folder naming**: lowercase (e.g., `controllers`, `models`).
    

---

## ✅ Example Workflow for Copilot

1. When creating a new API route:
    
    - First create a **TypeScript interface** in `types/`.
        
    - Add a **Mongoose model** in `models/`.
        
    - Add a **service function** in `services/`.
        
    - Add a **controller** that uses the service.
        
    - Register it in `routes/`.
        
    - Write a **test** for it.
        
2. For new frontend features:
    
    - Create a `feature/` folder with related components.
        
    - Add TypeScript types in `types/`.
        
    - Connect API via React Query hook in `hooks/`.
        
    - Build components with Tailwind + shadcn/ui.
        
    - Ensure accessibility (a11y).
