# EC2 Deployment Guide

This guide explains how to deploy the InterviewDock backend application on AWS EC2.

## Prerequisites

- EC2 instance running Amazon Linux 2 or Ubuntu
- Node.js 18+ installed
- PostgreSQL installed (or Docker)
- Git installed

## Quick Start

### 1. Install Dependencies on EC2

```bash
# Update system packages
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs  # Amazon Linux
# OR
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs  # Ubuntu

# Install PostgreSQL
sudo yum install -y postgresql postgresql-server  # Amazon Linux
# OR
sudo apt install -y postgresql postgresql-contrib  # Ubuntu

# Initialize PostgreSQL (Amazon Linux)
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE interviewdock;
CREATE USER postgres WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE interviewdock TO postgres;
\q
```

### 3. Clone and Setup Application

```bash
# Navigate to home directory
cd ~

# Clone repository
git clone <your-repo-url> InterviewDock
cd InterviewDock/backend

# Install dependencies
npm install

# Create production environment file
cp .env.production .env

# Edit .env with your configuration
nano .env
```

### 4. Configure Environment Variables

Edit the `.env` file:

```env
NODE_ENV=production
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password  # Change this!
DB_DATABASE=interviewdock

# IMPORTANT: Keep this true for initial setup
DB_SYNCHRONIZE=true
DB_LOGGING=false

# CORS Configuration
CORS_ORIGIN=*

# Server Configuration
MAX_PAGE_SIZE=100
DEFAULT_PAGE_SIZE=20
```

### 5. Build and Deploy

```bash
# Build TypeScript
npm run build

# Test the build
node dist/index.js

# If successful, you should see:
# ✅ Database connected successfully
# 🚀 Server running on port 5001
```

### 6. Seed the Database

```bash
# In a new terminal, seed the database
npm run seed

# You should see:
# ✅ Categories created
# ✅ Technologies created
# ✅ Questions created
```

### 7. Test the API

```bash
# Test health endpoint
curl http://localhost:5001/health

# Test categories endpoint
curl http://localhost:5001/api/categories

# Test questions endpoint
curl "http://localhost:5001/api/questions?page=1&limit=2"

# Test specific question title
curl -s "http://localhost:5001/api/questions?page=1&limit=2" | jq '.data.items[0].title'
```

## Production Setup with PM2

For production, use PM2 to keep the application running:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start dist/index.js --name "interviewdock-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command shown

# View logs
pm2 logs interviewdock-backend

# Monitor
pm2 monit

# Restart
pm2 restart interviewdock-backend
```

## Using Docker (Alternative)

If you prefer Docker on EC2:

```bash
# Install Docker
sudo yum install -y docker  # Amazon Linux
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start services
cd ~/InterviewDock/backend
docker-compose up -d

# Wait for database to be ready
sleep 10

# Seed the database (exec into container)
docker-compose exec backend npm run seed

# Check logs
docker-compose logs -f backend
```

## Troubleshooting

### Issue: "Internal server error" when querying questions

**Cause**: Database tables not created or database not seeded.

**Solutions**:

1. **Check if DB_SYNCHRONIZE is true in .env**:
   ```bash
   cat .env | grep DB_SYNCHRONIZE
   # Should show: DB_SYNCHRONIZE=true
   ```

2. **Restart the server to create tables**:
   ```bash
   pm2 restart interviewdock-backend
   # OR
   node dist/index.js
   ```

3. **Check server logs for database errors**:
   ```bash
   pm2 logs interviewdock-backend
   ```

4. **Verify database connection**:
   ```bash
   psql -h localhost -U postgres -d interviewdock -c "\dt"
   # Should show: categories, technologies, questions, tags, question_tags
   ```

5. **Run seed script**:
   ```bash
   npm run seed
   ```

6. **Check if data exists**:
   ```bash
   psql -h localhost -U postgres -d interviewdock -c "SELECT COUNT(*) FROM questions;"
   ```

### Issue: Cannot connect to database

**Check PostgreSQL is running**:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Check connection settings**:
```bash
# Test connection
psql -h localhost -U postgres -d interviewdock

# If fails, check pg_hba.conf
sudo nano /var/lib/pgsql/data/pg_hba.conf
# Ensure local connections are allowed
```

### Issue: Port 5001 already in use

**Find and kill process**:
```bash
lsof -i:5001
kill -9 <PID>
```

### Issue: Questions return null fields

**Check the full response**:
```bash
curl -s "http://localhost:5001/api/questions?page=1&limit=1" | jq '.'
```

**Verify database has data**:
```bash
psql -h localhost -U postgres -d interviewdock -c "SELECT id, title FROM questions LIMIT 1;"
```

## Security Recommendations

1. **Change database password**:
   - Update `DB_PASSWORD` in `.env`
   - Update PostgreSQL password

2. **Set DB_SYNCHRONIZE to false after initial setup**:
   ```env
   DB_SYNCHRONIZE=false
   ```
   This prevents accidental schema changes.

3. **Configure CORS properly**:
   ```env
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Use HTTPS**:
   - Set up SSL certificate (Let's Encrypt)
   - Use Nginx as reverse proxy

5. **Configure Security Group**:
   - Only allow necessary ports (22 for SSH, 5001 for API, or 80/443 if using Nginx)
   - Restrict SSH access to your IP

6. **Setup firewall**:
   ```bash
   sudo firewall-cmd --permanent --add-port=5001/tcp
   sudo firewall-cmd --reload
   ```

## Monitoring

### View application logs:
```bash
pm2 logs interviewdock-backend --lines 100
```

### Check application status:
```bash
pm2 status
```

### Monitor system resources:
```bash
htop
# OR
pm2 monit
```

### Check database size:
```bash
psql -h localhost -U postgres -d interviewdock -c "SELECT pg_size_pretty(pg_database_size('interviewdock'));"
```

## Backup

### Backup database:
```bash
cd ~/InterviewDock/backend
./scripts/backup-db.sh
```

### Restore database:
```bash
./scripts/restore-db.sh backup_file.sql
```

## Updates

### Pull latest code:
```bash
cd ~/InterviewDock/backend
git pull
npm install
npm run build
pm2 restart interviewdock-backend
```

## Support

If you encounter issues not covered here, check:
1. Server logs: `pm2 logs interviewdock-backend`
2. PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
3. System logs: `sudo tail -f /var/log/messages`
