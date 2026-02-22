# InterviewDock Backend

Production-ready backend API for the InterviewDock Interview Preparation Platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # TypeORM DataSource configuration
│   │   └── index.ts      # App configuration
│   ├── entities/         # TypeORM entities
│   │   ├── Category.ts
│   │   ├── Technology.ts
│   │   ├── Question.ts
│   │   └── Tag.ts
│   ├── services/         # Business logic
│   │   ├── CategoryService.ts
│   │   ├── TechnologyService.ts
│   │   └── QuestionService.ts
│   ├── controllers/      # Request handlers
│   │   ├── CategoryController.ts
│   │   ├── TechnologyController.ts
│   │   └── QuestionController.ts
│   ├── routes/           # API routes
│   │   ├── categoryRoutes.ts
│   │   ├── technologyRoutes.ts
│   │   ├── questionRoutes.ts
│   │   └── index.ts
│   ├── middleware/       # Custom middleware
│   │   └── errorHandler.ts
│   ├── utils/            # Utility functions
│   │   └── pagination.ts
│   ├── database/         # Database related
│   │   └── seed.ts       # Seed script
│   ├── app.ts            # Express app setup
│   └── index.ts          # Entry point
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Database Schema

### Tables

1. **categories**
   - id (UUID, PK)
   - name (unique)
   - description
   - slug (unique)
   - order
   - createdAt, updatedAt

2. **technologies**
   - id (UUID, PK)
   - name
   - description
   - slug
   - icon
   - order
   - categoryId (FK → categories)
   - createdAt, updatedAt

3. **questions**
   - id (UUID, PK)
   - title (indexed)
   - answer (markdown)
   - codeSnippet
   - codeLanguage
   - difficulty (enum: Easy/Medium/Hard, indexed)
   - technologyId (FK → technologies)
   - createdAt, updatedAt

4. **tags**
   - id (UUID, PK)
   - name (unique)
   - slug (unique)
   - createdAt, updatedAt

5. **question_tags** (junction table)
   - questionId (FK → questions)
   - tagId (FK → tags)

## API Endpoints

### Categories

```
GET /api/categories
```
Get all categories with their technologies.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Frontend",
      "description": "Client-side development technologies",
      "slug": "frontend",
      "order": 1,
      "technologies": [...]
    }
  ]
}
```

### Technologies

```
GET /api/technologies?categoryId={categoryId}
```
Get all technologies, optionally filtered by category.

**Query Parameters:**
- `categoryId` (optional): Filter by category

### Questions

```
GET /api/questions?technologyId={id}&difficulty={level}&tag={tag}&search={query}&page={n}&limit={n}
```
Get paginated questions with optional filters.

**Query Parameters:**
- `technologyId` (optional): Filter by technology
- `difficulty` (optional): Easy, Medium, or Hard
- `tag` (optional): Filter by tag slug
- `search` (optional): Search in question titles
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

**Response:**
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

```
GET /api/questions/:id
```
Get a specific question by ID.

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=interviewdock
   
   DEFAULT_PAGE_SIZE=20
   MAX_PAGE_SIZE=100
   ```

3. **Create database:**
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE interviewdock;
   \q
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

5. **Seed the database:**
   ```bash
   npm run seed
   ```

   This will populate the database with sample categories, technologies, and questions.

### Production Build

```bash
npm run build
npm start
```

## Features

### Layered Architecture
- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Data access (via TypeORM)

### Error Handling
- Global error handling middleware
- Custom `AppError` class for operational errors
- Async error wrapper for route handlers

### Pagination
- Configurable page size
- Maximum limit enforcement
- Rich pagination metadata (hasNext, hasPrev, etc.)

### Database Features
- Auto-sync in development
- Cascade deletes on foreign keys
- Indexes on frequently queried fields
- Enum types for difficulty levels

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run seed` - Seed database with sample data

### Code Style

- TypeScript strict mode enabled
- ES2020 target
- CommonJS modules

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database username | postgres |
| DB_PASSWORD | Database password | postgres |
| DB_DATABASE | Database name | interviewdock |
| DB_SYNCHRONIZE | Auto-create tables (true/false) | NODE_ENV === 'development' |
| DB_LOGGING | Enable SQL logging (true/false) | NODE_ENV === 'development' |
| DEFAULT_PAGE_SIZE | Default pagination size | 20 |
| MAX_PAGE_SIZE | Maximum pagination size | 100 |

## Deployment

### EC2 Deployment

For detailed EC2 deployment instructions, see [EC2-DEPLOYMENT.md](EC2-DEPLOYMENT.md).

**Quick EC2 Setup:**

```bash
# 1. Clone repository on EC2
git clone <your-repo-url> InterviewDock
cd InterviewDock/backend

# 2. Run automated setup script
./scripts/ec2-setup.sh

# 3. Verify deployment
curl "http://localhost:5001/api/questions?page=1&limit=1"
```

**Troubleshooting on EC2:**

If you encounter issues (e.g., "Internal server error" or null values), run the diagnostics script:

```bash
./scripts/diagnose.sh
```

Common issues:
- **Tables not created**: Set `DB_SYNCHRONIZE=true` in `.env` and restart
- **Database not seeded**: Run `npm run seed`
- **Connection failed**: Check PostgreSQL is running and credentials are correct

See [EC2-DEPLOYMENT.md](EC2-DEPLOYMENT.md) for comprehensive troubleshooting guide.

### Docker Deployment

See [DOCKER.md](DOCKER.md) for Docker deployment instructions.

## Notes

- This is a public API with no authentication
- Database syncs automatically in development mode
- In production, set `DB_SYNCHRONIZE=true` for initial setup, then `false` for safety
- Use migrations for production schema changes
- Sample data includes React, Vue, Node.js, PostgreSQL questions

