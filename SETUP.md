# Prerequisites

## Required Software

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

## Verify Installation

```bash
node --version   # Should be v18 or higher
npm --version    # Should be 8 or higher
psql --version   # Should be 14 or higher
```

# Quick Start Guide

## Option 1: Automated Setup (macOS/Linux)

```bash
chmod +x setup.sh
./setup.sh
```

Then follow the "Next Steps" instructions printed by the script.

## Option 2: Manual Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# Update DB_PASSWORD with your PostgreSQL password
```

### 2. Create Database

```bash
# Open PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE interviewdock;
\q
```

### 3. Start Backend

```bash
# From backend directory
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### 4. Seed Database

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

### 5. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### 6. Access Application

Open your browser and visit:
```
http://localhost:3000
```

# Testing the API

You can test the backend API directly:

```bash
# Get all categories
curl http://localhost:5000/api/categories

# Get all technologies
curl http://localhost:5000/api/technologies

# Get questions
curl http://localhost:5000/api/questions

# Get a specific question
curl http://localhost:5000/api/questions/{question-id}

# Health check
curl http://localhost:5000/health
```

# Common Issues

## Issue: Port 5000 already in use

**Solution:** Change the port in `backend/.env`:
```env
PORT=5001
```

Then update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

## Issue: PostgreSQL connection failed

**Solutions:**
1. Ensure PostgreSQL is running:
   ```bash
   # macOS with Homebrew
   brew services start postgresql@14
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Verify credentials in `backend/.env`
3. Check if database exists:
   ```bash
   psql -U postgres -l
   ```

## Issue: Database sync errors

**Solution:** Drop and recreate the database:
```bash
psql -U postgres
DROP DATABASE interviewdock;
CREATE DATABASE interviewdock;
\q
```

Then restart the backend server.

## Issue: Frontend can't fetch data

**Solutions:**
1. Ensure backend is running on port 5000
2. Check browser console for errors
3. Verify `VITE_API_URL` in `frontend/.env`
4. Check CORS settings (should be enabled by default)

## Issue: Seed script fails

**Solution:** Ensure the database is empty first:
```bash
psql -U postgres -d interviewdock
TRUNCATE question_tags, questions, tags, technologies, categories CASCADE;
\q
```

Then run seed again:
```bash
npm run seed
```

# Development Workflow

## Running Both Servers

You'll need **three terminal windows**:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - Commands
Use this for running seeds, database commands, etc.

## Making Changes

### Backend Changes
- Automatic restart with `ts-node-dev`
- Changes to entities require backend restart
- Database schema syncs automatically in dev mode

### Frontend Changes
- Hot module replacement (instant updates)
- No need to refresh browser
- State persists across most changes

# Production Deployment

## Backend

```bash
cd backend
npm run build
npm start
```

## Frontend

```bash
cd frontend
npm run build
```

Deploy the `frontend/dist/` directory to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Configure environment variables on your hosting platform.

## Database

For production:
1. Use a managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
2. Update connection string in backend environment
3. Run migrations instead of sync
4. Seed initial data if needed

# Folder Structure Overview

```
PrepEasy/
├── backend/
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── entities/       # Database models
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Helper functions
│   │   └── database/       # Seeds
│   ├── .env                # Environment variables (create from .env.example)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities
│   ├── .env                # Environment variables (create from .env.example)
│   └── package.json
│
├── README.md               # Main documentation
└── setup.sh                # Automated setup script
```

# Tech Stack Summary

## Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM
- **Port**: 5000 (configurable)

## Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Routing**: React Router v6
- **HTTP**: Axios
- **Port**: 3000 (configurable)

# Next Steps After Setup

1. **Explore the code structure** - Understand the layered architecture
2. **Test the API** - Use curl or Postman to test endpoints
3. **Customize the content** - Edit the seed script to add your own questions
4. **Enhance the UI** - Modify Tailwind classes and components
5. **Add features** - Implement bookmarking, dark mode, etc.

# Getting Help

- Check the main [README.md](README.md)
- Check [backend/README.md](backend/README.md)
- Check [frontend/README.md](frontend/README.md)
- Review error messages carefully
- Check browser console for frontend issues
- Check terminal output for backend issues

---

**Happy coding! 🚀**
