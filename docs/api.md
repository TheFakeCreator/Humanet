# Humanet API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Register**: `POST /auth/signup`
2. **Login**: `POST /auth/login` 
3. **Use token**: Include in subsequent requests
4. **Refresh token**: `POST /auth/refresh` (when token expires)
5. **Logout**: `POST /auth/logout`

---

## Authentication Endpoints

### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com", 
  "password": "securePassword123",
  "bio": "Software developer passionate about innovation",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "Software developer passionate about innovation",
      "karma": 0,
      "skills": ["JavaScript", "React", "Node.js"],
      "createdAt": "2023-09-02T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "username": "johndoe",
      "email": "john@example.com",
      "karma": 150
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "Software developer passionate about innovation",
      "karma": 150,
      "skills": ["JavaScript", "React", "Node.js"],
      "createdAt": "2023-09-02T10:30:00.000Z"
    }
  }
}
```

### Logout User
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Ideas Endpoints

### List Ideas
```http
GET /ideas?page=1&limit=10&sortBy=createdAt&domain=technology&search=AI
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `sortBy` (optional): Sort field (`createdAt`, `upvotes`, `forkCount`)
- `sortOrder` (optional): Sort direction (`asc`, `desc`)
- `domain` (optional): Filter by domain
- `tags` (optional): Filter by tags (comma-separated)
- `search` (optional): Search in title and description
- `authorId` (optional): Filter by author

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "title": "AI-Powered Code Review Assistant",
      "description": "An intelligent system that automatically reviews code for bugs, performance issues, and best practices.",
      "tags": ["AI", "CodeReview", "Developer Tools"],
      "domain": ["technology"],
      "authorId": "64a1b2c3d4e5f6789abcdef0",
      "author": {
        "_id": "64a1b2c3d4e5f6789abcdef0",
        "username": "johndoe",
        "karma": 150
      },
      "upvotes": 25,
      "forkCount": 3,
      "parentId": null,
      "createdAt": "2023-09-02T10:30:00.000Z",
      "updatedAt": "2023-09-02T12:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Get Single Idea
```http
GET /ideas/64a1b2c3d4e5f6789abcdef1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "idea": {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "title": "AI-Powered Code Review Assistant",
      "description": "An intelligent system that automatically reviews code for bugs, performance issues, and best practices.",
      "tags": ["AI", "CodeReview", "Developer Tools"],
      "domain": ["technology"],
      "authorId": "64a1b2c3d4e5f6789abcdef0",
      "author": {
        "_id": "64a1b2c3d4e5f6789abcdef0",
        "username": "johndoe",
        "karma": 150
      },
      "upvotes": 25,
      "upvoters": ["64a1b2c3d4e5f6789abcdef2"],
      "forkCount": 3,
      "parentId": null,
      "parent": null,
      "children": [
        {
          "_id": "64a1b2c3d4e5f6789abcdef3",
          "title": "AI Code Review for Mobile Apps",
          "authorId": "64a1b2c3d4e5f6789abcdef2"
        }
      ],
      "createdAt": "2023-09-02T10:30:00.000Z",
      "updatedAt": "2023-09-02T12:45:00.000Z"
    }
  }
}
```

### Create Idea
```http
POST /ideas
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI-Powered Code Review Assistant",
  "description": "An intelligent system that automatically reviews code for bugs, performance issues, and best practices.",
  "tags": ["AI", "CodeReview", "Developer Tools"],
  "domain": ["technology"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "idea": {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "title": "AI-Powered Code Review Assistant",
      "description": "An intelligent system that automatically reviews code for bugs, performance issues, and best practices.",
      "tags": ["AI", "CodeReview", "Developer Tools"],
      "domain": ["technology"],
      "authorId": "64a1b2c3d4e5f6789abcdef0",
      "upvotes": 0,
      "forkCount": 0,
      "parentId": null,
      "createdAt": "2023-09-02T10:30:00.000Z",
      "updatedAt": "2023-09-02T10:30:00.000Z"
    }
  }
}
```

### Update Idea
```http
PUT /ideas/64a1b2c3d4e5f6789abcdef1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Enhanced AI-Powered Code Review Assistant",
  "description": "An intelligent system with machine learning capabilities...",
  "tags": ["AI", "ML", "CodeReview", "Developer Tools"],
  "domain": ["technology", "software"]
}
```

### Delete Idea
```http
DELETE /ideas/64a1b2c3d4e5f6789abcdef1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Idea deleted successfully"
}
```

### Fork Idea
```http
POST /ideas/64a1b2c3d4e5f6789abcdef1/fork
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI Code Review for Mobile Apps",
  "description": "Specialized version for mobile app development..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "idea": {
      "_id": "64a1b2c3d4e5f6789abcdef3",
      "title": "AI Code Review for Mobile Apps",
      "description": "Specialized version for mobile app development...",
      "parentId": "64a1b2c3d4e5f6789abcdef1",
      "authorId": "64a1b2c3d4e5f6789abcdef2",
      "upvotes": 0,
      "forkCount": 0,
      "createdAt": "2023-09-02T11:30:00.000Z"
    }
  }
}
```

### Upvote Idea
```http
POST /ideas/64a1b2c3d4e5f6789abcdef1/upvote
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "upvoted": true,
    "upvotes": 26
  }
}
```

### Get Idea Family Tree
```http
GET /ideas/64a1b2c3d4e5f6789abcdef1/tree
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tree": {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "title": "AI-Powered Code Review Assistant",
      "description": "An intelligent system that automatically reviews code...",
      "author": {
        "_id": "64a1b2c3d4e5f6789abcdef0",
        "username": "johndoe"
      },
      "upvotes": 25,
      "forkCount": 3,
      "createdAt": "2023-09-02T10:30:00.000Z",
      "children": [
        {
          "_id": "64a1b2c3d4e5f6789abcdef3",
          "title": "AI Code Review for Mobile Apps",
          "author": {
            "_id": "64a1b2c3d4e5f6789abcdef2",
            "username": "janedoe"
          },
          "upvotes": 15,
          "forkCount": 1,
          "createdAt": "2023-09-02T11:30:00.000Z",
          "children": []
        }
      ]
    }
  }
}
```

---

## Comments Endpoints

### Get Idea Comments
```http
GET /ideas/64a1b2c3d4e5f6789abcdef1/comments?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef4",
      "text": "This is a brilliant idea! I've been looking for something like this.",
      "authorId": "64a1b2c3d4e5f6789abcdef2",
      "author": {
        "_id": "64a1b2c3d4e5f6789abcdef2",
        "username": "janedoe"
      },
      "ideaId": "64a1b2c3d4e5f6789abcdef1",
      "createdAt": "2023-09-02T11:00:00.000Z",
      "updatedAt": "2023-09-02T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Create Comment
```http
POST /ideas/64a1b2c3d4e5f6789abcdef1/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is a brilliant idea! I've been looking for something like this."
}
```

### Update Comment
```http
PUT /comments/64a1b2c3d4e5f6789abcdef4
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is an absolutely brilliant idea! I've been looking for something exactly like this."
}
```

### Delete Comment
```http
DELETE /comments/64a1b2c3d4e5f6789abcdef4
Authorization: Bearer <token>
```

---

## Users Endpoints

### Get User Profile
```http
GET /users/johndoe
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "username": "johndoe",
      "bio": "Software developer passionate about innovation",
      "karma": 150,
      "skills": ["JavaScript", "React", "Node.js"],
      "createdAt": "2023-09-01T10:30:00.000Z"
    }
  }
}
```

### Get User's Ideas
```http
GET /users/johndoe/ideas?page=1&limit=10
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Additional error details when available
  }
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Example Error Response
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "title": "Title is required",
      "description": "Description must be at least 10 characters"
    }
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window**: 15 minutes
- **Limit**: 100 requests per window per IP
- **Headers**: Rate limit info included in response headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693656600
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Data Validation

### Idea Validation
- `title`: Required, 3-100 characters
- `description`: Required, 10-5000 characters
- `tags`: Optional, array of strings, max 10 tags
- `domain`: Optional, array of valid domains

### User Validation
- `username`: Required, 3-30 characters, alphanumeric + underscore
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `bio`: Optional, max 500 characters
- `skills`: Optional, array of strings, max 20 skills

### Comment Validation
- `text`: Required, 1-1000 characters
