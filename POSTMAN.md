# InterviewDock API - Postman Collection

This directory contains Postman collection and environment files for testing the InterviewDock API.

## Files

- **InterviewDock-API.postman_collection.json** - Complete API collection with all endpoints
- **InterviewDock-Environments.postman_environment.json** - Environment configuration for local development

## Import into Postman

### Import Collection
1. Open Postman
2. Click on **Import** button (top left)
3. Select **InterviewDock-API.postman_collection.json**
4. Click **Import**

### Import Environment
1. Click on **Import** button
2. Select **InterviewDock-Environments.postman_environment.json**
3. Click **Import**
4. Select "InterviewDock - Local" from the environment dropdown (top right)

## API Endpoints

### Health Check
- **GET** `/health` - Check API server status

### Categories
- **GET** `/api/categories` - Get all categories
- **GET** `/api/categories/:id` - Get category by ID

### Technologies
- **GET** `/api/technologies` - Get all technologies
  - Query Parameters: `categoryId` (optional)
- **GET** `/api/technologies/:id` - Get technology by ID
- **POST** `/api/technologies` - Create new technology
  ```json
  {
    "name": "React",
    "slug": "react",
    "description": "A JavaScript library for building user interfaces",
    "icon": "react-icon.svg",
    "categoryId": "1",
    "order": 1
  }
  ```

### Questions
- **GET** `/api/questions` - Get all questions with filters
  - Query Parameters:
    - `technologyId` - Filter by technology ID
    - `difficulty` - Filter by difficulty (beginner, intermediate, advanced)
    - `tag` - Filter by tag
    - `search` - Search in title and answer
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
- **GET** `/api/questions/:id` - Get question by ID
- **POST** `/api/questions` - Create new question
  ```json
  {
    "title": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces...",
    "codeSnippet": "import React from 'react';...",
    "codeLanguage": "javascript",
    "difficulty": "beginner",
    "technologyId": "1",
    "tags": ["basics", "introduction"]
  }
  ```

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| base_url | http://localhost:3000 | Base URL for local development |

To use production environment, duplicate the environment and change the `base_url` to your production URL.

## Examples

### Get Questions with Filters
```
GET {{base_url}}/api/questions?technologyId=1&difficulty=beginner&page=1&limit=10
```

### Search Questions
```
GET {{base_url}}/api/questions?search=hooks&page=1&limit=10
```

### Create a Question
```
POST {{base_url}}/api/questions
Content-Type: application/json

{
  "title": "What is React?",
  "answer": "React is a JavaScript library...",
  "difficulty": "beginner",
  "technologyId": "1"
}
```

## Notes

- All POST requests require `Content-Type: application/json` header
- The collection uses environment variables for the base URL
- Path parameters (like `:id`) can be customized for each request
- Query parameters marked as "disabled" in the collection can be enabled as needed
