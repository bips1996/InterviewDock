# API Documentation

Complete API reference for PrepEasy (InterviewDock) REST API.

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Categories](#categories)
  - [Technologies](#technologies)
  - [Questions](#questions)
- [Using the API](#using-the-api)
- [Adding Questions Guide](#adding-questions-guide)
- [Postman Collection](#postman-collection)

---

## Overview

The PrepEasy API is a RESTful service that provides access to interview preparation content including:

- **Categories**: Top-level groupings (e.g., Frontend, Backend)
- **Technologies**: Specific tech stacks (e.g., React, Node.js, PostgreSQL)
- **Questions**: Interview questions with answers, code snippets, and tags

**Features:**
- Public API - no authentication required
- Pagination support for large datasets
- Advanced filtering and search
- Full CRUD operations (Create, Read, Update, Delete)
- Markdown support for rich content
- Syntax highlighting for code examples

---

## Base URL

### Local Development
```
http://localhost:5001
```

### Production
```
http://your-domain.com
https://api.your-domain.com
```

**API Prefix:** All API endpoints start with `/api`

**Example:** `http://localhost:5001/api/categories`

---

## Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data here
  }
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "details": {
    // Additional error details (optional)
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

### Common Error Messages

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "details": {
    "title": "Title is required",
    "difficulty": "Must be 'Easy', 'Medium', or 'Hard'"
  }
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "message": "Question not found"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "An unexpected error occurred"
}
```

---

## Endpoints

### Health Check

Check if the API server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "message": "InterviewDock API is running"
}
```

**Example:**
```bash
curl http://localhost:5001/health
```

---

### Categories

Categories are top-level groupings for technologies (e.g., Frontend, Backend).

#### Get All Categories

**Endpoint:** `GET /api/categories`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-1",
      "name": "Frontend",
      "slug": "frontend",
      "description": "Frontend technologies and frameworks",
      "icon": "frontend-icon.svg",
      "createdAt": "2026-03-10T10:00:00.000Z",
      "updatedAt": "2026-03-10T10:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Backend",
      "slug": "backend",
      "description": "Backend technologies and frameworks",
      "icon": "backend-icon.svg",
      "createdAt": "2026-03-10T10:00:00.000Z",
      "updatedAt": "2026-03-10T10:00:00.000Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5001/api/categories
```

#### Get Category by ID

**Endpoint:** `GET /api/categories/:id`

**Parameters:**
- `id` (path parameter): Category UUID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-1",
    "name": "Frontend",
    "slug": "frontend",
    "description": "Frontend technologies and frameworks",
    "icon": "frontend-icon.svg",
    "createdAt": "2026-03-10T10:00:00.000Z",
    "updatedAt": "2026-03-10T10:00:00.000Z",
    "technologies": [
      {
        "id": "tech-uuid-1",
        "name": "React",
        "slug": "react"
      },
      {
        "id": "tech-uuid-2",
        "name": "Vue.js",
        "slug": "vue-js"
      }
    ]
  }
}
```

**Example:**
```bash
curl http://localhost:5001/api/categories/uuid-1
```

---

### Technologies

Technologies are specific tech stacks within categories.

#### Get All Technologies

**Endpoint:** `GET /api/technologies`

**Query Parameters:**
- `categoryId` (optional): Filter by category UUID

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "tech-uuid-1",
      "name": "React",
      "slug": "react",
      "description": "A JavaScript library for building user interfaces",
      "icon": "react-icon.svg",
      "categoryId": "uuid-1",
      "createdAt": "2026-03-10T10:00:00.000Z",
      "updatedAt": "2026-03-10T10:00:00.000Z"
    },
    {
      "id": "tech-uuid-2",
      "name": "Node.js",
      "slug": "node-js",
      "description": "JavaScript runtime built on Chrome's V8 engine",
      "icon": "nodejs-icon.svg",
      "categoryId": "uuid-2",
      "createdAt": "2026-03-10T10:00:00.000Z",
      "updatedAt": "2026-03-10T10:00:00.000Z"
    }
  ]
}
```

**Examples:**
```bash
# Get all technologies
curl http://localhost:5001/api/technologies

# Filter by category
curl http://localhost:5001/api/technologies?categoryId=uuid-1
```

#### Get Technology by ID

**Endpoint:** `GET /api/technologies/:id`

**Parameters:**
- `id` (path parameter): Technology UUID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "tech-uuid-1",
    "name": "React",
    "slug": "react",
    "description": "A JavaScript library for building user interfaces",
    "icon": "react-icon.svg",
    "categoryId": "uuid-1",
    "category": {
      "id": "uuid-1",
      "name": "Frontend",
      "slug": "frontend"
    },
    "questionCount": 15,
    "createdAt": "2026-03-10T10:00:00.000Z",
    "updatedAt": "2026-03-10T10:00:00.000Z"
  }
}
```

**Example:**
```bash
curl http://localhost:5001/api/technologies/tech-uuid-1
```

#### Create Technology

**Endpoint:** `POST /api/technologies`

**Request Body:**
```json
{
  "name": "React",
  "slug": "react",
  "description": "A JavaScript library for building user interfaces",
  "icon": "react-icon.svg",
  "categoryId": "uuid-1",
  "order": 1
}
```

**Required Fields:**
- `name`: Technology name
- `slug`: URL-friendly identifier
- `categoryId`: Category UUID

**Optional Fields:**
- `description`: Technology description
- `icon`: Icon filename
- `order`: Display order (default: 0)

**Response:** 201 Created
```json
{
  "status": "success",
  "data": {
    "id": "new-tech-uuid",
    "name": "React",
    "slug": "react",
    "description": "A JavaScript library for building user interfaces",
    "icon": "react-icon.svg",
    "categoryId": "uuid-1",
    "order": 1,
    "createdAt": "2026-03-11T10:00:00.000Z",
    "updatedAt": "2026-03-11T10:00:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5001/api/technologies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React",
    "slug": "react",
    "categoryId": "uuid-1"
  }'
```

---

### Questions

Interview questions with answers, code snippets, and tags.

#### Get All Questions

**Endpoint:** `GET /api/questions`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (default: 1) | `?page=2` |
| `limit` | integer | Items per page (default: 20, max: 100) | `?limit=50` |
| `technologyId` | UUID | Filter by technology | `?technologyId=tech-uuid-1` |
| `difficulty` | string | Filter by difficulty (Easy, Medium, Hard) | `?difficulty=Medium` |
| `search` | string | Search in title and answer | `?search=hooks` |

**Response:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "question-uuid-1",
        "title": "What is the Virtual DOM in React?",
        "answer": "The Virtual DOM is a lightweight copy...",
        "codeSnippet": null,
        "codeLanguage": null,
        "difficulty": "Easy",
        "technologyId": "tech-uuid-1",
        "technology": {
          "id": "tech-uuid-1",
          "name": "React",
          "slug": "react"
        },
        "tags": [
          {
            "id": "tag-uuid-1",
            "name": "fundamentals"
          },
          {
            "id": "tag-uuid-2",
            "name": "virtual-dom"
          }
        ],
        "createdAt": "2026-03-10T10:00:00.000Z",
        "updatedAt": "2026-03-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Examples:**
```bash
# Get all questions (paginated)
curl http://localhost:5001/api/questions

# Page 2, 10 items per page
curl "http://localhost:5001/api/questions?page=2&limit=10"

# Filter by technology
curl "http://localhost:5001/api/questions?technologyId=tech-uuid-1"

# Filter by difficulty
curl "http://localhost:5001/api/questions?difficulty=Easy"

# Search
curl "http://localhost:5001/api/questions?search=hooks"

# Combine filters
curl "http://localhost:5001/api/questions?technologyId=tech-uuid-1&difficulty=Medium&page=1"
```

#### Get Question by ID

**Endpoint:** `GET /api/questions/:id`

**Parameters:**
- `id` (path parameter): Question UUID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "question-uuid-1",
    "title": "What is the Virtual DOM in React?",
    "answer": "The Virtual DOM is a lightweight copy of the actual DOM...",
    "codeSnippet": "// Example code",
    "codeLanguage": "javascript",
    "difficulty": "Easy",
    "technologyId": "tech-uuid-1",
    "technology": {
      "id": "tech-uuid-1",
      "name": "React",
      "slug": "react",
      "category": {
        "id": "uuid-1",
        "name": "Frontend",
        "slug": "frontend"
      }
    },
    "tags": [
      {
        "id": "tag-uuid-1",
        "name": "fundamentals"
      }
    ],
    "createdAt": "2026-03-10T10:00:00.000Z",
    "updatedAt": "2026-03-10T10:00:00.000Z"
  }
}
```

**Example:**
```bash
curl http://localhost:5001/api/questions/question-uuid-1
```

#### Create Question

**Endpoint:** `POST /api/questions`

**Request Body:**
```json
{
  "title": "What is the Virtual DOM in React?",
  "answer": "The Virtual DOM is a lightweight copy...",
  "difficulty": "Easy",
  "technologyId": "tech-uuid-1",
  "codeSnippet": "// Optional code example",
  "codeLanguage": "javascript",
  "tags": ["fundamentals", "virtual-dom", "performance"]
}
```

**Required Fields:**
- `title`: Question title (max 500 characters)
- `answer`: Question answer (supports Markdown)
- `difficulty`: "Easy", "Medium", or "Hard"
- `technologyId`: Technology UUID

**Optional Fields:**
- `codeSnippet`: Code example
- `codeLanguage`: Programming language (javascript, python, java, sql, etc.)
- `tags`: Array of tag names (will be created if they don't exist)

**Response:** 201 Created
```json
{
  "status": "success",
  "data": {
    "id": "new-question-uuid",
    "title": "What is the Virtual DOM in React?",
    "answer": "The Virtual DOM is a lightweight copy...",
    "codeSnippet": "// Optional code example",
    "codeLanguage": "javascript",
    "difficulty": "Easy",
    "technologyId": "tech-uuid-1",
    "tags": [
      {
        "id": "tag-uuid-1",
        "name": "fundamentals"
      }
    ],
    "createdAt": "2026-03-11T10:00:00.000Z",
    "updatedAt": "2026-03-11T10:00:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces.",
    "difficulty": "Easy",
    "technologyId": "tech-uuid-1",
    "tags": ["fundamentals"]
  }'
```

#### Update Question

**Endpoint:** `PUT /api/questions/:id`

**Parameters:**
- `id` (path parameter): Question UUID

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "answer": "Updated answer",
  "difficulty": "Medium",
  "codeSnippet": "// Updated code",
  "codeLanguage": "javascript",
  "tags": ["new-tag"]
}
```

**Response:** 200 OK
```json
{
  "status": "success",
  "data": {
    // Updated question object
  }
}
```

#### Delete Question

**Endpoint:** `DELETE /api/questions/:id`

**Parameters:**
- `id` (path parameter): Question UUID

**Response:** 200 OK
```json
{
  "status": "success",
  "message": "Question deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5001/api/questions/question-uuid-1
```

---

## Using the API

### With cURL

```bash
# GET request
curl http://localhost:5001/api/questions

# GET with query parameters
curl "http://localhost:5001/api/questions?page=1&limit=5"

# POST request
curl -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","answer":"Answer","difficulty":"Easy","technologyId":"uuid"}'

# PUT request
curl -X PUT http://localhost:5001/api/questions/uuid \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# DELETE request
curl -X DELETE http://localhost:5001/api/questions/uuid
```

### With JavaScript (fetch)

```javascript
// GET all questions
async function getQuestions() {
  const response = await fetch('http://localhost:5001/api/questions');
  const data = await response.json();
  return data.data.items;
}

// GET with filters
async function getReactQuestions() {
  const response = await fetch(
    'http://localhost:5001/api/questions?technologyId=tech-uuid-1&difficulty=Easy'
  );
  const data = await response.json();
  return data.data.items;
}

// CREATE question
async function createQuestion(questionData) {
  const response = await fetch('http://localhost:5001/api/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });
  const data = await response.json();
  return data.data;
}

// Example usage
createQuestion({
  title: 'What is React?',
  answer: 'React is a JavaScript library...',
  difficulty: 'Easy',
  technologyId: 'tech-uuid-1',
  tags: ['fundamentals'],
});
```

### With Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// GET all questions
const questions = await api.get('/questions');

// GET with filters
const reactQuestions = await api.get('/questions', {
  params: {
    technologyId: 'tech-uuid-1',
    difficulty: 'Easy',
    page: 1,
    limit: 10,
  },
});

// CREATE question
const newQuestion = await api.post('/questions', {
  title: 'What is React?',
  answer: 'React is a JavaScript library...',
  difficulty: 'Easy',
  technologyId: 'tech-uuid-1',
  tags: ['fundamentals'],
});

// UPDATE question
const updated = await api.put(`/questions/${id}`, {
  difficulty: 'Medium',
});

// DELETE question
await api.delete(`/questions/${id}`);
```

---

## Adding Questions Guide

### Writing Good Questions

#### 1. Clear, Concise Titles

**Good:**
- "What is the Virtual DOM in React?"
- "Explain the difference between var, let, and const"
- "How does the Event Loop work in Node.js?"

**Bad:**
- "React question"
- "Variables"
- "Event Loop stuff"

#### 2. Comprehensive Answers

Use Markdown for formatting:

```markdown
## Heading for sections

**Bold** for emphasis
*Italic* for subtle emphasis
`inline code` for variables/methods

### Subheading

- Bullet points
- For listing features

1. Numbered lists
2. For sequential steps

> Important notes in blockquotes

Key points clearly explained with examples.
```

#### 3. Code Examples

Always include code examples for:
- Syntax questions
- Comparison questions
- Implementation questions

```json
{
  "codeSnippet": "const example = 'code here';",
  "codeLanguage": "javascript"
}
```

**Supported languages:**
- `javascript` / `typescript`
- `python`
- `java`
- `sql`
- `html` / `css`
- `bash` / `shell`
- `json` / `yaml`

#### 4. Difficulty Levels

**Easy:** Fundamentals, definitions, basic syntax
```json
{
  "title": "What is JSX?",
  "difficulty": "Easy"
}
```

**Medium:** Practical applications, comparisons, patterns
```json
{
  "title": "What is the difference between useCallback and useMemo?",
  "difficulty": "Medium"
}
```

**Hard:** Advanced topics, internals, optimization
```json
{
  "title": "Explain the React Fiber architecture",
  "difficulty": "Hard"
}
```

#### 5. Effective Tags

Use 2-5 relevant tags:
```json
{
  "tags": ["fundamentals", "hooks", "performance"]
}
```

**Common tags:**
- `fundamentals` - Core concepts
- `es6` / `es2015` - Modern JavaScript
- `hooks` - React hooks
- `async-programming` - Promises, async/await
- `performance` - Optimization
- `best-practices` - Recommended patterns
- `security` - Security concerns
- `testing` - Testing approaches

### Sample Question Templates

#### Basic Concept (Easy)

```json
{
  "title": "What is [CONCEPT]?",
  "answer": "[CONCEPT] is a [brief definition].\n\n## Key Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Why It's Important\n\n[Explanation of why this matters]",
  "difficulty": "Easy",
  "technologyId": "tech-uuid",
  "tags": ["fundamentals"]
}
```

#### Comparison (Medium)

```json
{
  "title": "What is the difference between [A] and [B]?",
  "answer": "Both [A] and [B] serve similar purposes but differ in key ways:\n\n## [A]\n- Characteristic 1\n- Characteristic 2\n\n## [B]\n- Characteristic 1\n- Characteristic 2\n\n## When to Use\n- Use [A] when...\n- Use [B] when...",
  "codeSnippet": "// Example showing difference\nconst a = exampleA();\nconst b = exampleB();",
  "codeLanguage": "javascript",
  "difficulty": "Medium",
  "technologyId": "tech-uuid",
  "tags": ["comparison", "best-practices"]
}
```

#### Advanced Topic (Hard)

```json
{
  "title": "How does [ADVANCED_CONCEPT] work internally?",
  "answer": "[ADVANCED_CONCEPT] works by:\n\n## Process\n\n1. Step 1 with explanation\n2. Step 2 with explanation\n3. Step 3 with explanation\n\n## Key Points\n\n- Important detail 1\n- Important detail 2\n\n## Implications\n\n[Discussion of performance, trade-offs, etc.]",
  "codeSnippet": "// Example demonstrating the concept",
  "codeLanguage": "javascript",
  "difficulty": "Hard",
  "technologyId": "tech-uuid",
  "tags": ["advanced", "internals", "performance"]
}
```

### Getting Technology IDs

Before creating questions, get the technology ID:

```bash
# List all technologies
curl http://localhost:5001/api/technologies

# Filter by category
curl "http://localhost:5001/api/technologies?categoryId=category-uuid"
```

Response includes UUIDs you'll need:
```json
{
  "id": "tech-uuid-1",
  "name": "React",
  "slug": "react"
}
```

---

## Postman Collection

### Importing

1. Open Postman
2. Click **Import**
3. Select files:
   - `PrepEasy-API.postman_collection.json`
   - `PrepEasy-Environments.postman_environment.json`
   - `PrepEasy-Production.postman_environment.json`

### Environments

**Local Environment:**
```json
{
  "apiUrl": "http://localhost:5001/api"
}
```

**Production Environment:**
```json
{
  "apiUrl": "http://your-ec2-ip:5001/api"
}
```

Switch environments using the dropdown in the top-right corner.

### Available Requests

- Health Check
- Categories
  - Get All Categories
  - Get Category by ID
- Technologies
  - Get All Technologies
  - Get Technologies by Category
  - Get Technology by ID
  - Create Technology
- Questions
  - Get All Questions
  - Get Questions with Filters
  - Get Question by ID
  - Create Question
  - Update Question
  - Delete Question

---

## Rate Limiting

Currently, there are no rate limits on the API. For production use, consider implementing rate limiting based on your requirements.

---

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS).

**Development:** All origins allowed (`*`)

**Production:** Configure specific origins in backend `.env`:
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

---

## Best Practices

### Pagination
- Always use pagination for questions (large datasets)
- Default: 20 items per page
- Maximum: 100 items per page

### Filtering
- Combine filters for specific results
- Use search for text-based queries
- Filter by technology and difficulty for targeted questions

### Error Handling
- Always check `status` field
- Handle 404 for missing resources
- Validate input before POST/PUT requests

### Performance
- Cache category and technology lists (they change rarely)
- Use appropriate page sizes
- Filter on the server side, not client side

---

## Additional Resources

- **Local Development**: See `LOCAL-DEVELOPMENT.md`
- **Production Deployment**: See `PRODUCTION-DEPLOYMENT.md`
- **Main README**: See `README.md`
- **Postman Collection**: See project root

---

## Support

For API issues:
1. Check this documentation
2. Verify request format and parameters
3. Check API server logs
4. Ensure database is seeded with data
5. Test with Postman first before implementing in code
