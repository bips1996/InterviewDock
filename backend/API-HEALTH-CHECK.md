# API Health Check Guide

This guide contains commands to verify that the backend API is running correctly and all endpoints are working as expected.

## Prerequisites

- Backend services should be running (`docker-compose up`)
- `curl` and `jq` should be installed for testing

## Quick Health Check

### 1. Check Docker Containers Status

```bash
docker-compose ps
```

**Expected Output:**
- Both `interviewdock-backend` and `interviewdock-postgres` should show status as "running (healthy)"

### 2. Check Backend Logs

```bash
# View recent backend logs
docker-compose logs backend --tail=30

# Filter for startup/error messages
docker-compose logs backend --tail=30 | grep -E "(Server|started|listening|ERROR|Error)"
```

**Expected Output:**
```
🚀 Server running on port 5001
```

### 3. Check Database Logs

```bash
docker-compose logs postgres --tail=20
```

## API Endpoint Testing

### Categories Endpoint

Test if categories are being returned with nested technologies:

```bash
curl -s http://localhost:5001/api/categories | jq '.'
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "...",
      "name": "Frontend",
      "description": "Client-side development technologies",
      "slug": "frontend",
      "technologies": [...]
    }
  ]
}
```

### Questions Endpoint

Test questions endpoint with pagination:

```bash
# Get first page with 2 questions
curl -s "http://localhost:5001/api/questions?page=1&limit=2" | jq '.'

# Check total count
curl -s "http://localhost:5001/api/questions?page=1&limit=2" | jq '.pagination.total'

# Check if pagination is working
curl -s "http://localhost:5001/api/questions?page=1&limit=2" | jq '.pagination'
```

**Expected Response Structure:**
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 7,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Filter Questions by Technology

```bash
# Get React questions
curl -s "http://localhost:5001/api/questions?technology=react" | jq '.'

# Get questions by difficulty
curl -s "http://localhost:5001/api/questions?difficulty=Medium" | jq '.'
```

### Single Question Endpoint

```bash
# First, get a question ID
QUESTION_ID=$(curl -s "http://localhost:5001/api/questions?page=1&limit=1" | jq -r '.data[0].id')

# Then fetch that specific question
curl -s "http://localhost:5001/api/questions/$QUESTION_ID" | jq '.'
```

### Technologies Endpoint

```bash
curl -s http://localhost:5001/api/technologies | jq '.'
```

## Comprehensive Health Check Script

Create a simple script to run all checks:

```bash
#!/bin/bash
echo "=== Backend Health Check ==="
echo ""

echo "1. Checking Docker Containers..."
docker-compose ps
echo ""

echo "2. Testing Categories API..."
curl -s http://localhost:5001/api/categories > /dev/null && echo "✅ Categories API: OK" || echo "❌ Categories API: FAILED"

echo "3. Testing Questions API..."
curl -s "http://localhost:5001/api/questions?page=1&limit=1" > /dev/null && echo "✅ Questions API: OK" || echo "❌ Questions API: FAILED"

echo "4. Testing Technologies API..."
curl -s http://localhost:5001/api/technologies > /dev/null && echo "✅ Technologies API: OK" || echo "❌ Technologies API: FAILED"

echo "5. Checking Data Count..."
echo "   Categories: $(curl -s http://localhost:5001/api/categories | jq '.data | length')"
echo "   Total Questions: $(curl -s http://localhost:5001/api/questions | jq '.pagination.total')"
echo "   Technologies: $(curl -s http://localhost:5001/api/technologies | jq '.data | length')"

echo ""
echo "=== Health Check Complete ==="
```

## Troubleshooting

### Backend Not Responding

```bash
# Check if backend container is running
docker-compose ps backend

# View detailed logs
docker-compose logs backend -f

# Restart backend
docker-compose restart backend
```

### Database Connection Issues

```bash
# Check postgres container
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Reset Everything

```bash
# Stop all containers
docker-compose down -v

# Rebuild and start
docker-compose up --build -d

# Re-seed the database
docker-compose exec backend npm run seed
```

## Performance Testing

### Test Response Time

```bash
# Measure API response time
time curl -s http://localhost:5001/api/questions > /dev/null

# Using curl's built-in timing
curl -w "\nTime: %{time_total}s\n" -s http://localhost:5001/api/questions -o /dev/null
```

### Load Testing (Simple)

```bash
# Run 100 requests sequentially
for i in {1..100}; do
  curl -s http://localhost:5001/api/categories > /dev/null
  echo "Request $i completed"
done
```

## Database Verification

### Connect to PostgreSQL

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d interviewdock

# Run SQL queries
# SELECT COUNT(*) FROM categories;
# SELECT COUNT(*) FROM questions;
# \dt  # List all tables
# \q   # Quit
```

### Quick Query Examples

```bash
# Count records in each table
docker-compose exec -T postgres psql -U postgres -d interviewdock -c "SELECT COUNT(*) FROM categories;"
docker-compose exec -T postgres psql -U postgres -d interviewdock -c "SELECT COUNT(*) FROM technologies;"
docker-compose exec -T postgres psql -U postgres -d interviewdock -c "SELECT COUNT(*) FROM questions;"
docker-compose exec -T postgres psql -U postgres -d interviewdock -c "SELECT COUNT(*) FROM tags;"
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | Get all categories with technologies |
| `/api/technologies` | GET | Get all technologies |
| `/api/questions` | GET | Get paginated questions with filters |
| `/api/questions/:id` | GET | Get a specific question by ID |

### Query Parameters for Questions

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `technology` - Filter by technology slug
- `difficulty` - Filter by difficulty (Easy, Medium, Hard)
- `search` - Search in question title

## Example: Complete Workflow Test

```bash
# 1. Check services
docker-compose ps

# 2. Get all categories
curl -s http://localhost:5001/api/categories | jq '.data[] | {name, slug}'

# 3. Get React questions
curl -s "http://localhost:5001/api/questions?technology=react&page=1&limit=5" | jq '.data[] | {title, difficulty}'

# 4. Search for a specific topic
curl -s "http://localhost:5001/api/questions?search=hooks" | jq '.data[] | .title'

# 5. Check pagination
curl -s "http://localhost:5001/api/questions?page=2&limit=3" | jq '.pagination'
```

## Notes

- All successful API responses return `{"status": "success", "data": ...}`
- Failed requests return `{"status": "error", "message": "..."}`
- Use `| jq '.'` for pretty-printed JSON output
- Add `-v` flag to curl for verbose output (headers, etc.)
