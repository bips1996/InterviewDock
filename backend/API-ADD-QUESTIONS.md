# Adding Questions to PrepEasy API

This guide provides sample payloads for adding interview questions to the PrepEasy platform via the API.

## Table of Contents
- [API Endpoint](#api-endpoint)
- [Authentication](#authentication)
- [Request Schema](#request-schema)
- [Getting Technology IDs](#getting-technology-ids)
- [Sample Payloads](#sample-payloads)
- [Tips for Writing Questions](#tips-for-writing-questions)

---

## API Endpoint

**POST** `/api/questions`

**Content-Type:** `application/json`

---

## Authentication

Currently, the API does not require authentication. Access the admin interface at:
- URL: `https://yourdomain.com/adminX`
- Direct API: Send POST requests to the endpoint above

---

## Request Schema

### Required Fields
```typescript
{
  "title": string,           // Max 500 characters
  "answer": string,           // Text (supports Markdown)
  "difficulty": "Easy" | "Medium" | "Hard",
  "technologyId": string      // UUID of the technology
}
```

### Optional Fields
```typescript
{
  "codeSnippet": string,      // Code example (optional)
  "codeLanguage": string,     // e.g., "javascript", "python", "java"
  "tags": string[]            // Array of tag names (will be created if don't exist)
}
```

---

## Getting Technology IDs

First, fetch available technologies to get their IDs:

```bash
GET /api/technologies
```

**Response Example:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "React",
      "slug": "react",
      "categoryId": "..."
    },
    {
      "id": "7f3d1234-5678-90ab-cdef-1234567890ab",
      "name": "Node.js",
      "slug": "node-js",
      "categoryId": "..."
    }
  ]
}
```

**Common Technologies:**
- React
- Vue.js
- JavaScript
- TypeScript
- Node.js
- PostgreSQL
- MongoDB
- Spring Boot

---

## Sample Payloads

### 1. Basic Question (Easy)

```json
{
  "title": "What is the Virtual DOM in React?",
  "answer": "The Virtual DOM is a lightweight copy of the actual DOM kept in memory. React uses it to optimize rendering by:\n\n1. **Minimizing DOM manipulation** - Direct DOM updates are expensive\n2. **Batch updates** - Multiple changes are grouped together\n3. **Diffing algorithm** - Only changed elements are updated\n\nWhen state changes, React creates a new Virtual DOM tree, compares it with the previous one, and updates only the differences in the real DOM.",
  "difficulty": "Easy",
  "technologyId": "550e8400-e29b-41d4-a716-446655440000",
  "tags": ["fundamentals", "virtual-dom", "performance"]
}
```

### 2. Question with Code Snippet (Medium)

```json
{
  "title": "Explain the difference between `var`, `let`, and `const` in JavaScript",
  "answer": "JavaScript has three ways to declare variables, each with different scoping and mutability rules:\n\n## var\n- **Function-scoped** - Accessible throughout the function\n- **Hoisted** - Declaration moved to top of scope\n- **Can be redeclared** - Same variable name multiple times\n\n## let\n- **Block-scoped** - Only accessible within `{}`\n- **Temporal Dead Zone** - Cannot access before declaration\n- **Cannot be redeclared** in same scope\n\n## const\n- **Block-scoped** like `let`\n- **Cannot be reassigned** - Value cannot change\n- **Must be initialized** at declaration\n\n**Best Practice:** Use `const` by default, `let` when reassignment is needed, avoid `var`.",
  "codeSnippet": "// var - function scoped\nfunction varExample() {\n  if (true) {\n    var x = 10;\n  }\n  console.log(x); // 10 - accessible outside block\n}\n\n// let - block scoped\nfunction letExample() {\n  if (true) {\n    let y = 20;\n  }\n  console.log(y); // ReferenceError: y is not defined\n}\n\n// const - block scoped and immutable\nconst PI = 3.14159;\nPI = 3.14; // TypeError: Assignment to constant variable\n\n// But objects can be modified\nconst user = { name: 'John' };\nuser.name = 'Jane'; // This works!\nuser = {}; // TypeError: Assignment to constant variable",
  "codeLanguage": "javascript",
  "difficulty": "Medium",
  "technologyId": "7890abcd-ef12-3456-7890-abcdef123456",
  "tags": ["es6", "fundamentals", "variables"]
}
```

### 3. Advanced Question with Complex Answer (Hard)

```json
{
  "title": "How does the Event Loop work in Node.js?",
  "answer": "The Event Loop is the mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.\n\n## Phases of the Event Loop\n\n1. **Timers** - Executes `setTimeout()` and `setInterval()` callbacks\n2. **Pending Callbacks** - Executes I/O callbacks deferred to next iteration\n3. **Idle, Prepare** - Internal use only\n4. **Poll** - Retrieves new I/O events; executes I/O callbacks\n5. **Check** - `setImmediate()` callbacks executed here\n6. **Close Callbacks** - Socket close events (e.g., `socket.on('close')`)\n\n## Process\n\n```\n   ┌───────────────────────────┐\n┌─>│           timers          │\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │     pending callbacks     │\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n│  │       idle, prepare       │\n│  └─────────────┬─────────────┘      ┌───────────────┐\n│  ┌─────────────┴─────────────┐      │   incoming:   │\n│  │           poll            │<─────┤  connections, │\n│  └─────────────┬─────────────┘      │   data, etc.  │\n│  ┌─────────────┴─────────────┐      └───────────────┘\n│  │           check           │\n│  └─────────────┬─────────────┘\n│  ┌─────────────┴─────────────┐\n└──┤      close callbacks      │\n   └───────────────────────────┘\n```\n\n## Key Points\n\n- **Microtasks** (Promises) have priority over macrotasks (timers)\n- **process.nextTick()** fires before any phase\n- The poll phase blocks when queue is empty to wait for I/O",
  "codeSnippet": "// Example demonstrating execution order\nconsole.log('1 - Script start');\n\nsetTimeout(() => console.log('2 - setTimeout'), 0);\n\nsetImmediate(() => console.log('3 - setImmediate'));\n\nprocess.nextTick(() => console.log('4 - nextTick'));\n\nPromise.resolve().then(() => console.log('5 - Promise'));\n\nconsole.log('6 - Script end');\n\n/* Output:\n1 - Script start\n6 - Script end\n4 - nextTick\n5 - Promise\n2 - setTimeout\n3 - setImmediate\n*/",
  "codeLanguage": "javascript",
  "difficulty": "Hard",
  "technologyId": "7f3d1234-5678-90ab-cdef-1234567890ab",
  "tags": ["event-loop", "async-programming", "performance", "internals"]
}
```

### 4. Database Question (PostgreSQL)

```json
{
  "title": "What is the difference between INNER JOIN and LEFT JOIN in PostgreSQL?",
  "answer": "JOINs combine rows from multiple tables based on related columns. The main difference is how they handle non-matching rows.\n\n## INNER JOIN\n- Returns **only matching rows** from both tables\n- If no match exists, row is excluded\n- Most restrictive type of JOIN\n\n## LEFT JOIN (LEFT OUTER JOIN)\n- Returns **all rows from left table**\n- Matching rows from right table included\n- If no match, NULL values for right table columns\n- Use when you need all records from primary table\n\n## Performance Considerations\n- Index foreign key columns for better performance\n- LEFT JOINs can be slower than INNER JOINs\n- Use EXPLAIN ANALYZE to check query plans",
  "codeSnippet": "-- Sample Tables\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100)\n);\n\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  amount DECIMAL(10,2)\n);\n\n-- INNER JOIN - Only users with orders\nSELECT u.name, o.amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\n-- Result: Only shows users who placed orders\n-- John | 100.00\n-- Jane | 250.00\n\n-- LEFT JOIN - All users, with or without orders\nSELECT u.name, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n\n-- Result: Shows all users, NULL for no orders\n-- John  | 100.00\n-- Jane  | 250.00\n-- Alice | NULL",
  "codeLanguage": "sql",
  "difficulty": "Medium",
  "technologyId": "db3d9876-5432-10ab-cdef-9876543210ab",
  "tags": ["sql", "joins", "database", "fundamentals"]
}
```

### 5. React Hooks Question

```json
{
  "title": "When should you use useCallback vs useMemo in React?",
  "answer": "Both `useCallback` and `useMemo` are performance optimization hooks that memoize values, but they serve different purposes.\n\n## useCallback\n- **Memoizes functions** - Returns cached function reference\n- Use when passing callbacks to optimized child components\n- Prevents child re-renders due to new function references\n- Dependencies: Function recreated when deps change\n\n## useMemo\n- **Memoizes computed values** - Returns cached calculation result\n- Use for expensive computations\n- Prevents recalculation on every render\n- Dependencies: Value recalculated when deps change\n\n## When to Use\n\n**useCallback:**\n- Passing callbacks to `React.memo()` components\n- Dependencies in other hooks (useEffect, useMemo)\n- Referential equality matters\n\n**useMemo:**\n- Expensive calculations (filtering large arrays, complex math)\n- Deriving data from props/state\n- Creating objects/arrays that cause child re-renders\n\n## Important Note\nDon't optimize prematurely! Only use these hooks when you've identified actual performance issues.",
  "codeSnippet": "import React, { useState, useCallback, useMemo } from 'react';\n\nfunction ParentComponent() {\n  const [count, setCount] = useState(0);\n  const [items, setItems] = useState([1, 2, 3, 4, 5]);\n\n  // useCallback - Memoize function\n  const handleClick = useCallback(() => {\n    console.log('Button clicked');\n    setCount(c => c + 1);\n  }, []); // Function never changes\n\n  // useMemo - Memoize expensive calculation\n  const expensiveSum = useMemo(() => {\n    console.log('Calculating sum...');\n    return items.reduce((sum, item) => sum + item, 0);\n  }, [items]); // Only recalculate when items change\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <p>Sum: {expensiveSum}</p>\n      <ChildComponent onClick={handleClick} />\n    </div>\n  );\n}\n\n// Child component using React.memo\nconst ChildComponent = React.memo(({ onClick }) => {\n  console.log('Child rendered');\n  return <button onClick={onClick}>Click me</button>;\n});\n\nexport default ParentComponent;",
  "codeLanguage": "javascript",
  "difficulty": "Medium",
  "technologyId": "550e8400-e29b-41d4-a716-446655440000",
  "tags": ["hooks", "performance", "optimization", "react"]
}
```

---

## Tips for Writing Questions

### 1. Use Markdown for Formatting
The `answer` field supports full Markdown syntax:

```markdown
## Headings
Use `##` for sections

**Bold** for emphasis
*Italic* for subtle emphasis
`code` for inline code

- Bullet points
- For lists

1. Numbered lists
2. For steps

> Blockquotes for important notes
```

### 2. Code Snippets
- Always specify `codeLanguage` when including code
- Supported languages: `javascript`, `typescript`, `python`, `java`, `sql`, `html`, `css`, `bash`
- Keep code examples concise and relevant
- Add comments to explain complex parts

### 3. Difficulty Guidelines

**Easy:**
- Fundamental concepts
- Basic definitions
- Simple syntax questions

**Medium:**
- Practical applications
- Comparisons between concepts
- Common patterns and best practices

**Hard:**
- Advanced topics
- Internal mechanisms
- Performance optimization
- Complex architectural questions

### 4. Tags Best Practices
- Use 2-5 relevant tags per question
- Use lowercase with hyphens (e.g., `hooks`, `state-management`)
- Common tags: `fundamentals`, `es6`, `hooks`, `performance`, `async-programming`, `database`, `sql`, `best-practices`

### 5. Title Guidelines
- Keep titles clear and concise (under 100 characters)
- Start with question words: "What", "How", "Why", "When", "Explain"
- Be specific about the technology/concept

---

## Testing Your Payload

### Using cURL
```bash
curl -X POST http://localhost:5001/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces.",
    "difficulty": "Easy",
    "technologyId": "550e8400-e29b-41d4-a716-446655440000",
    "tags": ["fundamentals"]
  }'
```

### Using Postman
1. Import the `PrepEasy-API.postman_collection.json` from project root
2. Select the "Create Question" request
3. Update the body with your payload
4. Send request

### Response Format
**Success (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "new-uuid-here",
    "title": "What is React?",
    "answer": "React is a JavaScript library...",
    "difficulty": "Easy",
    "technologyId": "550e8400-e29b-41d4-a716-446655440000",
    "tags": [
      {
        "id": "tag-uuid",
        "name": "fundamentals",
        "slug": "fundamentals"
      }
    ],
    "createdAt": "2026-02-22T10:30:00.000Z",
    "updatedAt": "2026-02-22T10:30:00.000Z"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

---

## Quick Reference

### Difficulty Enum
```typescript
enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard"
}
```

### Supported Code Languages
- `javascript`
- `typescript`
- `python`
- `java`
- `sql`
- `html`
- `css`
- `bash`
- `json`
- `yaml`

### Common Technology Names
- React
- Vue.js
- Angular
- JavaScript
- TypeScript
- Node.js
- Express
- PostgreSQL
- MongoDB
- MySQL
- Spring Boot
- Python
- Django
- Flask

---

## Troubleshooting

**Q: I get a 404 error**  
A: Make sure the backend is running on the correct port (default: 5001)

**Q: Invalid technologyId error**  
A: Fetch technologies first using `GET /api/technologies` to get valid IDs

**Q: Tags not appearing**  
A: Tags are created automatically. Ensure they're in an array format: `["tag1", "tag2"]`

**Q: Code snippet not displaying correctly**  
A: Check that `codeLanguage` is specified and uses a supported language

---

## Additional Resources

- Full API Documentation: See `/backend/README.md`
- Postman Collection: `PrepEasy-API.postman_collection.json`
- Sample Questions: Check `/backend/src/database/seed.ts` for examples
