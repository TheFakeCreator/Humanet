<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# HumaNet Project Instructions

This is a Turborepo workspace for HumaNet, an open innovation platform. When working on this project:

## Project Structure

- Use JavaScript (not TypeScript) for all code
- Follow the monorepo structure with apps in `apps/` and shared packages in `packages/`
- Use the shared ESLint and Prettier configuration from `@humanet/config`

## Applications

- `web` - Frontend application using Express for serving static files
- `api` - Backend API using Node.js + Express
- `license-site` - Static site for Open Idea Commons License

## Coding Standards

- Use ES6+ features and modern JavaScript
- Follow the ESLint configuration from the shared config package
- Use Prettier for consistent formatting
- Prefer functional programming patterns where appropriate
- Use meaningful variable and function names

## Turborepo Commands

- Use `turbo run <task>` for running tasks across workspaces
- Leverage caching for build and lint tasks
- Use the pipeline configuration in `turbo.json`

## Development Workflow

- Run `npm run dev` to start all applications in development mode
- Use `npm run build` to build all applications
- Follow semantic versioning for package updates
