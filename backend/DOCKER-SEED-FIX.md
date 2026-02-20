# Docker Seed Fix - Summary

## Problem

When running `docker-compose up` and trying to seed the database, you encountered:

```
Error: Cannot find module './seed.ts'
Require stack:
- /app/src/database/imaginaryUncacheableRequireResolveScript
```

## Root Cause

The issue occurred because:

1. **Production Dockerfile** - The original Dockerfile was production-optimized and only included compiled JavaScript files (`dist/` folder)
2. **Seed Script** - The `npm run seed` command uses `ts-node src/database/seed.ts`, which requires:
   - TypeScript source files (`src/` folder)
   - `ts-node` package (dev dependency)
3. **Missing Files** - Neither were included in the Docker image, causing the module not found error

## Solution Implemented

### 1. Updated Dockerfile (Development-Friendly)

**File**: `backend/Dockerfile`

Added to the production stage:
```dockerfile
# Copy source files for development/seeding
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs tsconfig.json ./
RUN npm install --save-dev ts-node typescript @types/node
```

This allows the container to run TypeScript files with ts-node.

### 2. Added Production Seed Script

**File**: `backend/package.json`

```json
{
  "scripts": {
    "seed": "ts-node src/database/seed.ts",      // Development
    "seed:prod": "node dist/database/seed.js"     // Production (NEW)
  }
}
```

### 3. Created Dockerfile.prod (Production-Only)

**File**: `backend/Dockerfile.prod`

A separate production-optimized Dockerfile that:
- Only includes compiled code
- No TypeScript source files
- Smaller image size
- For production deployments where seeding is done separately

### 4. Updated Docker Compose

**File**: `backend/docker-compose.yml`

Added environment variables:
```yaml
environment:
  DB_SYNCHRONIZE: ${DB_SYNCHRONIZE:-true}
  DB_LOGGING: ${DB_LOGGING:-false}
```

### 5. Created Helper Scripts

#### docker-seed.sh
**File**: `backend/scripts/docker-seed.sh`

Convenient script to seed database in Docker:
```bash
./scripts/docker-seed.sh        # Development
./scripts/docker-seed.sh prod   # Production
```

#### docker-entrypoint.sh
**File**: `backend/docker-entrypoint.sh`

Smart entrypoint that:
- Checks which seed script is available
- Uses ts-node if available, otherwise uses compiled version
- Can be controlled with `SEED_DATABASE` environment variable

### 6. Updated Documentation

**File**: `backend/DOCKER.md`

Comprehensive Docker guide with:
- Full stack vs PostgreSQL-only setup
- Seeding troubleshooting
- Production deployment guide
- Common issues and solutions

## How to Use

### Option 1: Rebuild and Seed (Recommended)

```bash
# Stop current containers
docker-compose down

# Rebuild backend with source files
docker-compose build --no-cache backend

# Start all services (auto-seeds on startup)
docker-compose up -d

# Verify
curl "http://localhost:5001/api/questions?page=1&limit=1"
```

### Option 2: Use Helper Script

```bash
# If containers are already running
./scripts/docker-seed.sh
```

### Option 3: Seed from Host Machine

```bash
# Run only PostgreSQL in Docker
docker-compose up -d postgres

# Seed from your local machine
npm run seed
```

### Option 4: Manual Seed in Container

```bash
# Execute seed command in running container
docker-compose exec backend npm run seed
```

## Verification

Test that everything works:

```bash
# 1. Check containers are running
docker-compose ps

# 2. Check backend logs
docker-compose logs backend | tail -20

# 3. Test API
curl http://localhost:5001/health
curl http://localhost:5001/api/categories
curl -s "http://localhost:5001/api/questions?page=1&limit=1" | jq '.data.items[0].title'

# 4. Check database directly
docker-compose exec postgres psql -U postgres -d interviewdock -c "SELECT COUNT(*) FROM questions;"
```

Expected results:
- Health endpoint returns `{"status":"ok"}`
- Categories endpoint returns array of categories
- Questions endpoint returns questions with valid titles (not null)
- Database has 7+ questions

## Production Considerations

For production deployments:

### Use Production Dockerfile

```bash
# Build production image
docker build -f Dockerfile.prod -t backend:prod .
```

### Separate Seeding from Runtime

In production, seed the database once during initial setup:

```bash
# Initial setup with DB_SYNCHRONIZE=true
docker-compose -f docker-compose.prod.yml up -d

# Seed database
docker-compose -f docker-compose.prod.yml exec backend npm run seed:prod

# Update to DB_SYNCHRONIZE=false
# Edit .env.production and set:
DB_SYNCHRONIZE=false

# Restart
docker-compose -f docker-compose.prod.yml restart backend
```

### Alternative: Use Migrations

For production schema changes, use migrations instead of synchronize:

```bash
# Generate migration
npm run typeorm migration:generate -- -n InitialSchema

# Run migration in production
docker-compose exec backend npm run typeorm migration:run
```

## Files Modified/Created

### Modified Files
- ✅ `backend/Dockerfile` - Added source files and ts-node
- ✅ `backend/package.json` - Added `seed:prod` script
- ✅ `backend/docker-compose.yml` - Added DB_SYNCHRONIZE env var
- ✅ `backend/docker-compose.prod.yml` - Added production settings
- ✅ `backend/DOCKER.md` - Comprehensive documentation

### New Files
- ✅ `backend/Dockerfile.prod` - Production-optimized image
- ✅ `backend/docker-entrypoint.sh` - Smart entrypoint script
- ✅ `backend/scripts/docker-seed.sh` - Seeding helper script

## Quick Reference

| Scenario | Command |
|----------|---------|
| Start full stack | `docker-compose up -d` |
| Rebuild backend | `docker-compose build --no-cache backend` |
| Seed database | `./scripts/docker-seed.sh` |
| View logs | `docker-compose logs -f backend` |
| PostgreSQL CLI | `docker-compose exec postgres psql -U postgres -d interviewdock` |
| Stop all | `docker-compose down` |
| Reset everything | `docker-compose down -v && rm -rf postgres_data` |

## Additional Notes

- The development Dockerfile (default) now includes source files for flexibility
- For production, use `Dockerfile.prod` for a smaller, optimized image
- The database seeding happens automatically on first startup in development mode
- In production, seed manually and then set `DB_SYNCHRONIZE=false`

## Support

If you encounter any issues:

1. Check logs: `docker-compose logs backend`
2. Verify containers: `docker-compose ps`
3. Check database: `docker-compose exec postgres psql -U postgres -d interviewdock -c "\dt"`
4. See [DOCKER.md](DOCKER.md) for comprehensive troubleshooting

---

**Status**: ✅ Issue resolved - Docker seeding now works correctly!
