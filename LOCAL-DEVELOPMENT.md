# Local Development Setup Guide

Complete guide for setting up and running PrepEasy (InterviewDock) on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start (Automated)](#quick-start-automated)
- [Manual Setup](#manual-setup)
  - [Option 1: Docker Setup (Recommended)](#option-1-docker-setup-recommended)
  - [Option 2: Native Setup](#option-2-native-setup)
- [Running the Application](#running-the-application)
- [Database Management](#database-management)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** 8 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Choose Your Database Option

**Option 1: Docker (Recommended - Easier)**
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))

**Option 2: Native PostgreSQL**
- PostgreSQL 14 or higher ([Download](https://www.postgresql.org/download/))

### Verify Installation

```bash
node --version   # Should be v18 or higher
npm --version    # Should be v8 or higher
git --version    # Any recent version

# For Docker setup:
docker --version
docker-compose --version

# For native PostgreSQL:
psql --version   # Should be 14 or higher
```

---

## Quick Start (Automated)

For macOS/Linux users, use the automated setup script:

```bash
# Make the script executable
chmod +x setup.sh

# Run the setup
./setup.sh
```

The script will:
- Check prerequisites
- Install dependencies for backend and frontend
- Set up environment files
- Create the database
- Start all services
- Seed the database with sample data

Then follow the "Next Steps" instructions printed by the script.

---

## Manual Setup

### Option 1: Docker Setup (Recommended)

Docker provides an isolated, consistent environment for development.

#### 1. Clone the Repository

```bash
git clone <your-repo-url> PrepEasy
cd PrepEasy
```

#### 2. Backend Setup with Docker

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start PostgreSQL + Backend with Docker
docker-compose up -d
```

This will:
- Pull PostgreSQL 14 Alpine image
- Build the backend Node.js image
- Create and start both containers
- Auto-seed the database with sample data
- Map backend to port 5001

#### 3. Verify Backend Services

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Test API
curl http://localhost:5001/health
curl http://localhost:5001/api/categories
```

You should see:
```
NAME                      STATUS
interviewdock-postgres    Up (healthy)
interviewdock-backend     Up
```

#### 4. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=http://localhost:5001/api
EOF

# Start development server
npm run dev
```

#### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/health

#### Docker Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Stop and remove all (including volumes)
docker-compose down -v

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d interviewdock

# Run migrations
docker-compose exec backend npm run migration:run

# View migration status
docker-compose exec backend npm run migration:show

# Manually seed database
./scripts/docker-seed.sh
# or
docker-compose exec backend npm run seed
```

---

### Option 2: Native Setup

Run PostgreSQL and the application directly on your machine.

#### 1. Clone the Repository

```bash
git clone <your-repo-url> PrepEasy
cd PrepEasy
```

#### 2. Setup PostgreSQL Database

```bash
# Start PostgreSQL service
# macOS with Homebrew:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# Windows: Start from Services app or pgAdmin

# Create database
psql -U postgres
```

In the PostgreSQL prompt:

```sql
CREATE DATABASE interviewdock;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE interviewdock TO postgres;
\q
```

#### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
NODE_ENV=development
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interviewdock
DB_SYNCHRONIZE=true
DB_LOGGING=false

# CORS Configuration
CORS_ORIGIN=*

# Server Configuration
MAX_PAGE_SIZE=100
DEFAULT_PAGE_SIZE=20
EOF

# Start backend server
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5001
```

#### 4. Run Migrations

Apply database schema migrations:

```bash
cd backend
npm run migration:run
```

You should see:
```
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
X migrations are already loaded in the database.
No migrations are pending
```

#### 5. Seed the Database

In a new terminal:

```bash
cd backend
npm run seed
```

You should see:
```
🎉 Seed completed successfully!
📊 Summary:
   - Categories: 2
   - Technologies: 6
   - Questions: 7
   - Tags: 12
```

#### 6. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=http://localhost:5001/api
EOF

# Start development server
npm run dev
```

#### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/health

---

## Running the Application

### Start All Services

**With Docker:**
```bash
# Terminal 1: Backend + Database
cd backend
docker-compose up

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Without Docker:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Stop Services

**With Docker:**
```bash
# In backend directory
docker-compose down
```

**Without Docker:**
- Press `Ctrl+C` in each terminal

---

## Database Management

### Migrations

Run migrations to set up or update your database schema:

**With Docker:**
```bash
cd backend
docker-compose exec backend npm run migration:run
```

**Without Docker:**
```bash
cd backend
npm run migration:run
```

**View migration status:**
```bash
cd backend
npm run migration:show
```

**Create a new migration:**
```bash
cd backend
npm run migration:generate -- src/migrations/MigrationName
```

**Revert last migration:**
```bash
cd backend
npm run migration:revert
```

### Seeding

**Initial seed with sample data:**
```bash
cd backend
npm run seed
```

**Re-seed (drops existing data):**
```bash
cd backend
npm run seed
```

**Sample data includes:**
- 2 Categories (Frontend, Backend)
- 6 Technologies (React, Vue, JavaScript, Node.js, PostgreSQL, MongoDB)
- 7 Sample questions
- 12 Tags

### Database CLI Access

**With Docker:**
```bash
cd backend
docker-compose exec postgres psql -U postgres -d interviewdock
```

**Without Docker:**
```bash
psql -U postgres -d interviewdock
```

**Useful SQL commands:**
```sql
-- List all tables
\dt

-- View categories
SELECT * FROM categories;

-- View technologies
SELECT * FROM technologies;

-- View questions
SELECT id, title, difficulty FROM questions;

-- Count records
SELECT COUNT(*) FROM questions;

-- Exit
\q
```

### Database Reset

**With Docker:**
```bash
cd backend
docker-compose down -v  # Removes volumes
docker-compose up -d     # Recreates database
npm run seed            # Re-seed data
```

**Without Docker:**
```sql
psql -U postgres
DROP DATABASE interviewdock;
CREATE DATABASE interviewdock;
\q
```
```bash
cd backend
npm run seed
```

---

## Testing

### Manual API Testing

**Health check:**
```bash
curl http://localhost:5001/health
```

**Get categories:**
```bash
curl http://localhost:5001/api/categories
```

**Get technologies:**
```bash
curl http://localhost:5001/api/technologies
```

**Get questions:**
```bash
# All questions
curl "http://localhost:5001/api/questions"

# With pagination
curl "http://localhost:5001/api/questions?page=1&limit=5"

# Filter by difficulty
curl "http://localhost:5001/api/questions?difficulty=Easy"

# Search
curl "http://localhost:5001/api/questions?search=react"

# Specific question
curl "http://localhost:5001/api/questions/<question-id>"
```

### Using Postman

Import the provided Postman collection:

1. Open Postman
2. Click **Import**
3. Select `PrepEasy-API.postman_collection.json`
4. Import the environment: `PrepEasy-Environments.postman_environment.json`
5. Select "PrepEasy - Local" environment
6. Test endpoints

---

## Troubleshooting

### Backend Issues

**Port 5001 already in use:**
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
PORT=5002
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
docker-compose ps  # For Docker
# or
pg_isready  # For native

# Verify credentials in backend/.env
# Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
```

**TypeORM errors:**
```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**API connection errors:**
1. Verify backend is running: `curl http://localhost:5001/health`
2. Check `frontend/.env` has correct API URL
3. Check browser console for CORS errors
4. Restart frontend after changing `.env`

**Blank page:**
1. Check browser console for errors
2. Verify `VITE_API_URL` in `.env`
3. Clear browser cache
4. Run `npm run build` to check for build errors

**Port 3000 already in use:**
```bash
# Vite will automatically use next available port (3001, 3002, etc.)
# Or specify port:
npm run dev -- --port 3001
```

### Docker Issues

**Container won't start:**
```bash
# View logs
docker-compose logs

# Remove and rebuild
docker-compose down
docker-compose up --build
```

**Database not seeding:**
```bash
# Manually run seed
cd backend
./scripts/docker-seed.sh

# Or check logs
docker-compose logs backend
```

**Permission issues:**
```bash
# On Linux, fix permissions
sudo chown -R $USER:$USER postgres_data/
```

### Common Solutions

**"Module not found" errors:**
```bash
# Reinstall dependencies
npm install
```

**TypeScript errors:**
```bash
# Rebuild
npm run build
```

**Database schema mismatch:**
```bash
# With DB_SYNCHRONIZE=true, restart backend
# Or drop and recreate database
```

---

## Development Workflow

### Making Changes

1. **Backend changes:**
   - Edit files in `backend/src/`
   - Server auto-restarts with `ts-node-dev`
   - Check terminal for errors

2. **Frontend changes:**
   - Edit files in `frontend/src/`
   - Browser auto-refreshes
   - Check browser console for errors

3. **Database schema changes:**
   - Update entities in `backend/src/entities/`
   - With `DB_SYNCHRONIZE=true`, changes apply automatically
   - For production, use migrations

### Adding Sample Data

Edit `backend/src/database/seed.ts` and run:
```bash
cd backend
npm run seed
```

### Project Structure

```
PrepEasy/
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/    # Database & app config
│   │   ├── entities/  # TypeORM models
│   │   ├── services/  # Business logic
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/    # API routes
│   │   ├── middleware/ # Express middleware
│   │   ├── utils/     # Helper functions
│   │   └── database/  # Seed scripts
│   ├── scripts/       # Utility scripts
│   └── docker-compose.yml
│
└── frontend/          # React app
    ├── src/
    │   ├── components/ # React components
    │   ├── pages/      # Page components
    │   ├── services/   # API client
    │   ├── store/      # State management
    │   ├── types/      # TypeScript types
    │   └── lib/        # Utilities
    └── vite.config.ts
```

---

## Environment Variables Reference

### Backend (.env)

```bash
NODE_ENV=development
PORT=5001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interviewdock
DB_SYNCHRONIZE=true  # Auto-sync schema (dev only!)
DB_LOGGING=false

# CORS
CORS_ORIGIN=*

# Pagination
MAX_PAGE_SIZE=100
DEFAULT_PAGE_SIZE=20
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5001/api
```

---

## Next Steps

Once your local environment is running:

1. **Browse the application** at http://localhost:3000
2. **Explore the API** using Postman or curl
3. **Add your own questions** via the admin interface
4. **Review the codebase** and make changes
5. **Check API-DOCUMENTATION.md** for API reference
6. **Read PRODUCTION-DEPLOYMENT.md** when ready to deploy

---

## Additional Resources

- **API Documentation**: See `API-DOCUMENTATION.md`
- **Production Deployment**: See `PRODUCTION-DEPLOYMENT.md`
- **Backup Scripts**: See `backend/scripts/db_backup/Backup-Guide.md`
- **Project README**: See `README.md`

---

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs: `docker-compose logs` or terminal output
3. Verify all prerequisites are installed
4. Ensure ports 3000 and 5001 are available
5. Check that environment files are configured correctly
