# EC2 Quick Fix - Questions Returning Null

## Problem
When running on EC2:
```bash
curl -s "http://localhost:5001/api/questions?page=1&limit=2" | jq '.data.items[0].title'
# Returns: null
# OR
{"status": "error", "message": "Internal server error"}
```

## Root Cause
In production (`NODE_ENV=production`), TypeORM's `synchronize` is set to `false`, meaning database tables are NOT automatically created. When the application starts:
1. ✅ Server connects to PostgreSQL successfully
2. ❌ Tables don't exist (no synchronize)
3. ❌ Queries fail with internal errors

## Solution Steps

### Option 1: Automated Fix (Recommended)

```bash
# Run the automated setup script
cd ~/InterviewDock/backend
./scripts/ec2-setup.sh
```

This script will:
- ✅ Check dependencies
- ✅ Configure environment
- ✅ Build application
- ✅ Create database tables
- ✅ Seed data
- ✅ Start with PM2
- ✅ Verify everything works

### Option 2: Manual Fix

```bash
cd ~/InterviewDock/backend

# 1. Create/Edit .env file
nano .env

# Add these lines:
DB_SYNCHRONIZE=true
DB_LOGGING=false

# 2. Restart application (if using PM2)
pm2 restart interviewdock-backend

# 3. Check logs to verify tables were created
pm2 logs interviewdock-backend

# 4. Seed the database
npm run seed

# 5. Test the API
curl -s "http://localhost:5001/api/questions?page=1&limit=1" | jq '.'
```

## Verification

After applying the fix, test these endpoints:

```bash
# 1. Health check
curl http://localhost:5001/health
# Expected: {"status":"ok","message":"InterviewDock API is running"}

# 2. Categories
curl http://localhost:5001/api/categories | jq '.'
# Expected: Array of categories with technologies

# 3. Questions with title
curl -s "http://localhost:5001/api/questions?page=1&limit=1" | jq '.data.items[0].title'
# Expected: Question title (not null)
```

## Diagnostics

If issues persist, run the diagnostics script:

```bash
cd ~/InterviewDock/backend
./scripts/diagnose.sh
```

This will check:
- ✅ Node.js and PostgreSQL installation
- ✅ Environment configuration
- ✅ Database connection
- ✅ Tables existence and data
- ✅ Application status
- ✅ API endpoints

## Common Issues & Fixes

### Issue 1: "relation 'questions' does not exist"

**Cause**: Tables not created

**Fix**:
```bash
# Set DB_SYNCHRONIZE=true in .env
echo "DB_SYNCHRONIZE=true" >> .env

# Restart server
pm2 restart interviewdock-backend
```

### Issue 2: "Question count: 0" or empty results

**Cause**: Database not seeded

**Fix**:
```bash
npm run seed
```

### Issue 3: "Cannot connect to database"

**Cause**: PostgreSQL not running or wrong credentials

**Fix**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql

# Verify credentials in .env
cat .env | grep DB_
```

### Issue 4: PM2 app shows "errored"

**Cause**: Build failed or configuration error

**Fix**:
```bash
# Check logs
pm2 logs interviewdock-backend --lines 50

# Rebuild
npm run build

# Restart
pm2 restart interviewdock-backend
```

## Production Safety

After initial setup and verification:

1. **Disable auto-sync** to prevent accidental schema changes:
   ```bash
   # Edit .env
   nano .env
   
   # Change to:
   DB_SYNCHRONIZE=false
   
   # Restart
   pm2 restart interviewdock-backend
   ```

2. **Use migrations** for schema changes in production

3. **Backup database** before any schema changes:
   ```bash
   ./scripts/backup-db.sh
   ```

## Key Files

- `/backend/.env` - Environment configuration
- `/backend/EC2-DEPLOYMENT.md` - Full deployment guide
- `/backend/scripts/ec2-setup.sh` - Automated setup
- `/backend/scripts/diagnose.sh` - Diagnostics tool
- `/backend/README.md` - Complete documentation

## Quick Commands Reference

```bash
# View application logs
pm2 logs interviewdock-backend

# Restart application
pm2 restart interviewdock-backend

# Stop application
pm2 stop interviewdock-backend

# Start application
pm2 start dist/index.js --name interviewdock-backend

# Monitor application
pm2 monit

# Check database
psql -U postgres -d interviewdock -c "SELECT COUNT(*) FROM questions;"

# Reseed database
npm run seed

# Run diagnostics
./scripts/diagnose.sh
```

## Getting Help

If issues persist:

1. Run diagnostics: `./scripts/diagnose.sh`
2. Check logs: `pm2 logs interviewdock-backend --lines 100`
3. Verify configuration: `cat .env`
4. Check database: `psql -U postgres -d interviewdock -c "\dt"`

## Summary

The issue occurs because TypeORM doesn't automatically create tables in production. The fix is to:

1. Set `DB_SYNCHRONIZE=true` in `.env`
2. Restart the application
3. Seed the database
4. Verify with API tests
5. Optionally set `DB_SYNCHRONIZE=false` after verification

Use the automated script (`./scripts/ec2-setup.sh`) for the easiest deployment experience.
