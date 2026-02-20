# 🐳 Docker Production Deployment Guide

## One-Click Production Setup

Your InterviewDock backend + database is now fully Dockerized and production-ready!

## 🚀 Quick Start

### Development
```bash
cd backend
docker-compose up --build
```

### Production Deployment

**First time setup:**
```bash
cd backend

# Copy production environment template
cp .env.production .env

# Edit .env with your production credentials
nano .env  # or use your favorite editor

# Run one-click deployment
./scripts/deploy.sh
```

**Subsequent deployments:**
```bash
./scripts/deploy.sh
```

## 📦 What's Included

### Services
- **PostgreSQL Database** (port 5432)
  - Persistent volume storage
  - Health checks
  - Auto-restart
  
- **Node.js Backend** (port 5001)
  - Multi-stage optimized build
  - TypeScript compiled
  - Production dependencies only
  - Health monitoring
  - Auto-restart on failure

### Files Created
- `Dockerfile` - Multi-stage Node.js build
- `docker-compose.yml` - Development configuration
- `docker-compose.prod.yml` - Production overrides
- `.dockerignore` - Build optimization
- `.env.production` - Production environment template
- `scripts/deploy.sh` - One-click deployment script
- `scripts/backup-db.sh` - Database backup script
- `scripts/restore-db.sh` - Database restore script

## 🎯 Available Commands

### Deployment
```bash
# Deploy to production
./scripts/deploy.sh

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Clean up everything (including volumes)
docker-compose down -v
```

### Database Management
```bash
# Backup database
./scripts/backup-db.sh

# Restore database
./scripts/restore-db.sh backups/interviewdock_backup_20260220_120000.sql.gz

# Access database CLI
docker exec -it interviewdock-postgres psql -U postgres -d interviewdock
```

### Monitoring
```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Check container health
docker inspect interviewdock-backend | grep -A 5 Health
```

## 🔒 Security Features

- ✅ Non-root container user
- ✅ Environment-based secrets
- ✅ Multi-stage builds (smaller attack surface)
- ✅ Resource limits in production
- ✅ Health checks
- ✅ Automatic restarts

## 📝 Production Checklist

Before going live, make sure to:

1. **Update Environment Variables**
   - [ ] Change database password in `.env`
   - [ ] Set production CORS origin
   - [ ] Configure proper PORT if needed

2. **Infrastructure Setup**
   - [ ] Set up reverse proxy (nginx/traefik)
   - [ ] Configure SSL certificates (Let's Encrypt)
   - [ ] Set up domain and DNS
   - [ ] Configure firewall rules

3. **Monitoring & Backups**
   - [ ] Set up database backup cron job
   - [ ] Configure logging aggregation
   - [ ] Set up monitoring/alerting
   - [ ] Test restore procedure

4. **Performance**
   - [ ] Adjust resource limits if needed
   - [ ] Configure connection pooling
   - [ ] Set up caching if required

## 🌐 Access Points

After deployment:
- **API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/categories
- **Database**: localhost:5432

## 🔄 Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
./scripts/deploy.sh
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose config
```

### Database connection issues
```bash
# Check if database is healthy
docker-compose ps

# Verify database logs
docker-compose logs postgres

# Test database connection
docker exec interviewdock-postgres pg_isready -U postgres
```

### Port conflicts
```bash
# Change ports in .env file
PORT=5002
DB_PORT=5433

# Restart services
docker-compose down
docker-compose up -d
```

## 📊 Resource Requirements

**Minimum:**
- CPU: 1 core
- RAM: 1GB
- Disk: 5GB

**Recommended:**
- CPU: 2 cores
- RAM: 2GB
- Disk: 20GB (with logs and backups)

## 🎉 You're All Set!

Your application is production-ready with:
- ✅ One-click deployment
- ✅ Automatic database initialization
- ✅ Health monitoring
- ✅ Easy backup/restore
- ✅ Scalable architecture
