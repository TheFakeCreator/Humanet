# HumaNet

HumaNet is an open innovation platform where users can post ideas, fork them, collaborate, and track progress.

## Project Structure

This is a Turborepo workspace containing the following applications and packages:

### Apps

- **`web`** - Frontend application (http://localhost:3000)
- **`api`** - Backend API using Node.js + Express (http://localhost:3001)
- **`license-site`** - Static site for Open Idea Commons License (http://localhost:3002)

### Packages

- **`@humanet/config`** - Shared ESLint and Prettier configuration

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

```bash
npm install
```

### Development

Run all apps in development mode:

```bash
npm run dev
```

This will start:

- Web app on http://localhost:3000
- API on http://localhost:3001
- License site on http://localhost:3002

### Build

Build all apps:

```bash
npm run build
```

### Other Commands

- `npm run lint` - Lint all apps and packages
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build artifacts

## Turborepo

This project uses [Turborepo](https://turbo.build) for:

- Fast, incremental builds
- Smart caching
- Parallel execution
- Task pipelines

## Contributing

This is the initial workspace setup. Business logic and UI components will be added in future iterations.

## License

Open Idea Commons License (see license-site for details)
