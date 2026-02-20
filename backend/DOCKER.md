# Docker Setup for InterviewDock Backend

This directory includes Docker Compose setups for running the complete backend stack (PostgreSQL + Node.js API) or just PostgreSQL.

## Available Configurations

- **docker-compose.yml** - Development setup (PostgreSQL + Backend with auto-seeding)
- **docker-compose.prod.yml** - Production-optimized setup (extends base config)
- **Dockerfile** - Development-friendly image (includes ts-node for seeding)
- **Dockerfile.prod** - Production-optimized image (compiled code only)

## Quick Start - Full Stack (Development)

### 1. Start All Services

```bash
docker-compose up -d
```

This will:
- Pull the PostgreSQL 14 Alpine image
- Build the backend Node.js image
- Create containers for both services
- Auto-seed the database with sample data
- Map port 5001 to your local machine

### 2. Verify Services are Running

```bash
docker-compose ps
```

You should see:
```
NAME                      IMAGE               STATUS
interviewdock-postgres    postgres:14-alpine  Up (healthy)
interviewdock-backend     backend:latest      Up
```

### 3. Check Logs

```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just database
docker-compose logs -f postgres
```

### 4. Test the API

```bash
# Health check
curl http://localhost:5001/health

# Get categories
curl http://localhost:5001/api/categories

# Get questions
curl "http://localhost:5001/api/questions?page=1&limit=5"
```

## Quick Start - PostgreSQL Only

If you want to run only PostgreSQL and run the backend locally:

```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Verify container is running
docker-compose ps

# In another terminal, run backend locally
npm run dev

# Seed database
npm run seed
```

## Database Seeding

### Automatic Seeding (Development)

The development docker-compose.yml automatically seeds the database on first start.

### Manual Seeding

If you need to reseed or the automatic seeding failed:

```bash
# Using the helper script (recommended)
./scripts/docker-seed.sh

# Or manually
docker-compose exec backend npm run seed
```

### Seeding Issues Fix

**Problem**: `Error: Cannot find module './seed.ts'`

**Cause**: The seed script expects TypeScript files but the Docker image only has compiled JavaScript.

**Solution**:

The current Dockerfile now includes source files and ts-node for development. If you still encounter issues:

```bash
# Rebuild the backend image
docker-compose build --no-cache backend

# Restart services
docker-compose up -d

# Seed the database
./scripts/docker-seed.sh
```

**Alternative**: Seed from host machine instead:

```bash
# Start only PostgreSQL in Docker
docker-compose up -d postgres

# Seed from your local machine
npm run seed
```

## Container Management

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Data (⚠️ This will delete all data)

```bash
docker-compose down -v
rm -rf postgres_data
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart postgres
```

### Rebuild Backend

```bash
# Rebuild backend image
docker-compose build --no-cache backend

# Rebuild and restart
docker-compose up -d --build backend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service  
docker-compose logs -f backend
docker-compose logs -f postgres
```

## Connect to PostgreSQL CLI

From inside the container:

```bash
docker-compose exec postgres psql -U postgres -d interviewdock
```

From your host machine (requires psql installed):

```bash
psql -h localhost -U postgres -d interviewdock
```

Password: `postgres`

Common queries:

```sql
-- List tables
\dt

-- Count questions
SELECT COUNT(*) FROM questions;

-- View sample questions
SELECT id, title, difficulty FROM questions LIMIT 5;
```

## Environment Variables

The Docker Compose setup uses environment variables from your `.env` file:

```env
NODE_ENV=development
PORT=5001

DB_HOST=localhost           # Use 'postgres' for backend container
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interviewdock
DB_SYNCHRONIZE=true        # Auto-create tables
DB_LOGGING=false           # SQL logging

DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

**Important**: When backend runs in Docker, DB_HOST is automatically set to `postgres` (the service name).

## Data Persistence

- Database data is persisted in `./postgres_data/` (or `postgres_data_prod` for production)
- This directory is git-ignored
- Data persists when containers are stopped
- To reset: `docker-compose down -v && rm -rf postgres_data`

## Health Check

Both containers include health checks:

```bash
docker-compose ps
```

Status should show `Up (healthy)` when services are ready.

## Troubleshooting

### Issue: Seeding Fails with "Cannot find module './seed.ts'"

**Solution**:

```bash
# Option 1: Use the helper script
./scripts/docker-seed.sh

# Option 2: Rebuild with source files included
docker-compose build --no-cache backend
docker-compose up -d
docker-compose exec backend npm run seed

# Option 3: Seed from host machine
docker-compose up -d postgres  # Only PostgreSQL
npm run seed  # Run locally
```

### Issue: Backend Shows "Internal server error"

**Cause**: Database tables not created or not seeded

**Solution**:

```bash
# Check backend logs
docker-compose logs backend

# Ensure DB_SYNCHRONIZE=true
echo "DB_SYNCHRONIZE=true" >> .env

# Restart backend
docker-compose restart backend

# Seed database
./scripts/docker-seed.sh
```

### Issue: Port Already in Use

If port 5432 or 5001 is already in use:

```bash
# Check what's using the port
lsof -i:5432
lsof -i:5001

# Stop local PostgreSQL
brew services stop postgresql  # macOS
sudo systemctl stop postgresql  # Linux

# Or change ports in .env
PORT=5002
DB_PORT=5433
```

### Issue: Container Won't Start

Check logs for errors:

```bash
# Check specific service logs
docker-compose logs postgres
docker-compose logs backend

# Check Docker daemon
docker info
```

### Issue: Cannot Connect from Backend to Database

1. Verify containers are on same network:
   ```bash
   docker network inspect backend_interviewdock-network
   ```

2. Verify container is running and healthy:
   ```bash
   docker-compose ps
   ```

3. Test connection from backend container:
   ```bash
   docker-compose exec backend nc -zv postgres 5432
   ```

4. Verify environment variables:
   ```bash
   docker-compose exec backend env | grep DB_
   ```

### Reset Everything

Complete reset (deletes all data):

```bash
docker-compose down -v
rm -rf postgres_data
docker-compose build --no-cache
docker-compose up -d
./scripts/docker-seed.sh
```

## Production Deployment

### Using Production Configuration

```bash
# Use production docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Build production image
docker build -f Dockerfile.prod -t interviewdock-backend:prod .

# Run production container
docker run -d \
  --name interviewdock-backend-prod \
  -p 5001:5001 \
  --env-file .env.production \
  interviewdock-backend:prod
```

### Production Checklist

- [ ] Change all default passwords
- [ ] Set `DB_SYNCHRONIZE=false` after initial setup
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS
- [ ] Configure logging and monitoring
- [ ] Set up automated backups
- [ ] Use secrets management (not .env files)
- [ ] Configure resource limits
- [ ] Set up health monitoring
- [ ] Use managed database service for production

### Production Database Seeding

```bash
# One-time seeding for production
docker-compose -f docker-compose.prod.yml exec backend npm run seed

# Then disable auto-sync
docker-compose -f docker-compose.prod.yml exec backend \
  sh -c 'echo "DB_SYNCHRONIZE=false" >> .env'

# Restart
docker-compose -f docker-compose.prod.yml restart backend
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres

# View resource usage
docker stats

# Clean up unused Docker resources
docker system prune -a

# Export database backup
docker-compose exec postgres pg_dump -U postgres interviewdock > backup.sql

# Import database backup
docker-compose exec -T postgres psql -U postgres interviewdock < backup.sql

# Check database size
docker-compose exec postgres psql -U postgres -d interviewdock \
  -c "SELECT pg_size_pretty(pg_database_size('interviewdock'));"
```

## Scripts Reference

- **./scripts/docker-seed.sh** - Easily seed database in Docker
- **./scripts/backup-db.sh** - Backup database
- **./scripts/restore-db.sh** - Restore database backup
- **./scripts/diagnose.sh** - Run diagnostics (for EC2/local)

## Additional Resources

- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

For EC2 deployment without Docker, see [EC2-DEPLOYMENT.md](EC2-DEPLOYMENT.md).

