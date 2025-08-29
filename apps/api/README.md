# HumaNet API

Express backend for HumaNet MVP - an open innovation platform for managing ideas.

## Features

- ✅ Create, read, update, and delete ideas
- ✅ Fork existing ideas
- ✅ Update idea status (open, in-progress, merged)
- ✅ Get ideas by user
- ✅ JSON file persistence
- ✅ Request logging with Morgan
- ✅ Error handling and validation

## API Endpoints

### Health Check

- `GET /` - API health check

### Ideas Management

- `GET /ideas` - Get all ideas
- `GET /ideas/:id` - Get idea by ID
- `POST /ideas` - Create a new idea
- `POST /ideas/:id/fork` - Fork an existing idea
- `PATCH /ideas/:id/status` - Update idea status
- `DELETE /ideas/:id` - Delete an idea

### User Ideas

- `GET /users/:username/ideas` - Get all ideas by a specific user

## Data Structure

Each idea contains:

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "tags": ["array", "of", "strings"],
  "status": "open|in-progress|merged",
  "createdBy": "username",
  "createdAt": "ISO timestamp",
  "forkedFrom": "uuid or null"
}
```

## Usage Examples

### Create a new idea

```bash
curl -X POST http://localhost:3001/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Great Idea",
    "description": "This is a revolutionary concept",
    "tags": ["innovation", "tech"],
    "createdBy": "john_doe"
  }'
```

### Fork an idea

```bash
curl -X POST http://localhost:3001/ideas/550e8400-e29b-41d4-a716-446655440001/fork \
  -H "Content-Type: application/json" \
  -d '{"createdBy": "jane_smith"}'
```

### Update idea status

```bash
curl -X PATCH http://localhost:3001/ideas/550e8400-e29b-41d4-a716-446655440001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

## Running the API

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API runs on http://localhost:3001 by default.

## Data Storage

Ideas are stored in `ideas.json` at the project root. The file is automatically created if it doesn't exist.
