# Quick Start Guide - InterviewDock

## ✅ Setup Complete!

Your InterviewDock application is now fully configured with Docker PostgreSQL.

## 🐳 Docker PostgreSQL Setup

### Current Status
- ✅ PostgreSQL 14 running in Docker
- ✅ Container name: `interviewdock-postgres`
- ✅ Port: 5432
- ✅ Data persisted in: `backend/postgres_data/`
- ✅ Backend running on: http://localhost:5001
- ✅ Database seeded with sample data

### Quick Commands

#### Start PostgreSQL Container
```bash
cd backend
docker-compose up -d
```

#### Stop PostgreSQL Container
```bash
cd backend
docker-compose down
```

#### View Container Logs
```bash
cd backend
docker-compose logs -f postgres
```

#### Check Container Status
```bash
cd backend
docker-compose ps
```

#### Access PostgreSQL CLI
```bash
cd backend
docker-compose exec postgres psql -U postgres -d interviewdock
```

## 🚀 Running the Application

### Backend (Already Running)
```bash
cd backend
npm run dev
```
- API runs on: http://localhost:5001
- Health check: http://localhost:5001/health

### Seed Database
```bash
cd backend
npm run seed
```

### Frontend
```bash
cd frontend
npm run dev
```
- App runs on: http://localhost:3000

## 📡 API Endpoints

Base URL: `http://localhost:5001/api`

### Categories
```bash
GET /api/categories
```

### Technologies
```bash
GET /api/technologies
GET /api/technologies?categoryId={id}
```

### Questions
```bash
GET /api/questions
GET /api/questions?technologyId={id}
GET /api/questions?difficulty=Easy|Medium|Hard
GET /api/questions?search={query}
GET /api/questions?page=1&limit=20
GET /api/questions/{id}
```

## 🧪 Test the API

```bash
# Health check
curl http://localhost:5001/health

# Get all categories
curl http://localhost:5001/api/categories

# Get all technologies
curl http://localhost:5001/api/technologies

# Get questions (with pagination)
curl "http://localhost:5001/api/questions?page=1&limit=10"

# Get React questions
curl "http://localhost:5001/api/questions?technologyId=YOUR_TECH_ID"

# Search questions
curl "http://localhost:5001/api/questions?search=hooks"
```

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interviewdock

DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

## 📦 Sample Data

The database has been seeded with:
- **2 Categories**: Frontend, Backend
- **6 Technologies**: React, Vue.js, JavaScript, Node.js, PostgreSQL, Spring Boot
- **7 Questions**: Sample interview questions with full answers
- **12 Tags**: hooks, state-management, performance, async, etc.

## 🐛 Troubleshooting

### Port 5000 Issue (Resolved)
The backend now runs on **port 5001** instead of 5000 (macOS AirPlay uses 5000).

### PostgreSQL Connection Issues
1. Check if container is running:
   ```bash
   docker-compose ps
   ```

2. Check container health:
   ```bash
   docker-compose logs postgres
   ```

3. Restart container:
   ```bash
   docker-compose restart
   ```

### Reset Database
```bash
cd backend
docker-compose down
rm -rf postgres_data
docker-compose up -d
sleep 5
npm run seed
```

## 📁 Important Files

### Backend
- `backend/docker-compose.yml` - PostgreSQL container config
- `backend/.env` - Environment variables
- `backend/src/database/seed.ts` - Database seeding script
- `backend/DOCKER.md` - Detailed Docker documentation

### Frontend
- `frontend/.env` - API URL configuration
- `frontend/src/config/index.ts` - App configuration

## 🎯 Next Steps

1. **Start the frontend**:
   ```bash
   cd frontend
   npm install  # If not already done
   npm run dev
   ```

2. **Visit the application**:
   Open http://localhost:3000 in your browser

3. **Explore the features**:
   - Browse questions by category
   - Filter by technology
   - Search questions
   - View detailed answers with code examples

## 📚 Documentation

- [Main README](../README.md)
- [Setup Guide](../SETUP.md)
- [Backend README](backend/README.md)
- [Docker Guide](backend/DOCKER.md)
- [Frontend README](frontend/README.md)

---

**Application is ready! 🎉**

Backend: http://localhost:5001  
Frontend: http://localhost:3000  
Database: PostgreSQL (Docker) on port 5432
