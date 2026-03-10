# Production Deployment Guide

Complete guide for deploying PrepEasy (InterviewDock) to production environments.

## Table of Contents
- [Overview](#overview)
- [Architecture Options](#architecture-options)
- [Backend Deployment](#backend-deployment)
  - [Option 1: AWS EC2 with Docker](#option-1-aws-ec2-with-docker-recommended)
  - [Option 2: AWS EC2 Native](#option-2-aws-ec2-native)
- [Frontend Deployment](#frontend-deployment)
  - [Option 1: Vercel](#option-1-vercel-recommended)
  - [Option 2: Netlify](#option-2-netlify)
  - [Option 3: Cloudflare Pages](#option-3-cloudflare-pages)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Custom Domain Configuration](#custom-domain-configuration)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

PrepEasy consists of two separate applications:

- **Backend**: Node.js/Express REST API + PostgreSQL database
- **Frontend**: React SPA (Single Page Application)

**Recommended Production Stack:**
- Backend: AWS EC2 + Docker + PostgreSQL
- Frontend: Vercel or Netlify
- SSL: Let's Encrypt (free) or Cloudflare

---

## Architecture Options

### Option A: Complete Separation (Recommended)
- **Backend**: AWS EC2 (or any VPS)
- **Frontend**: Vercel/Netlify/Cloudflare Pages
- **Pros**: Easy to deploy, separate scaling, free frontend hosting
- **Cons**: Need to handle CORS and HTTPS properly

### Option B: Single Server
- **Both**: AWS EC2 with nginx
- **Pros**: Single server, simple architecture
- **Cons**: More configuration, need to manage both services

This guide focuses on **Option A** (recommended).

---

## Backend Deployment

### Option 1: AWS EC2 with Docker (Recommended)

Docker provides consistent, isolated environments for production.

#### Prerequisites

- AWS account
- EC2 instance (t2.micro or larger)
- SSH access to your instance
- Domain or subdomain for API (optional but recommended)

#### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2**
2. **Launch Instance**:
   - AMI: Amazon Linux 2023 or Ubuntu 22.04 LTS
   - Instance type: t2.micro (free tier) or larger
   - Storage: 8GB minimum, 20GB recommended
3. **Configure Security Group**:
   ```
   Type            Protocol    Port Range    Source
   SSH             TCP         22            Your IP
   HTTP            TCP         80            0.0.0.0/0
   HTTPS           TCP         443           0.0.0.0/0
   Custom TCP      TCP         5001          0.0.0.0/0
   PostgreSQL      TCP         5432          Your IP only
   ```
4. **Create or select key pair** for SSH access
5. **Launch instance**

#### Step 2: Connect to EC2

```bash
# Make key private
chmod 400 your-key.pem

# SSH to instance
ssh -i "your-key.pem" ec2-user@your-ec2-public-dns
```

#### Step 3: Install Docker

**For Amazon Linux 2023:**
```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login for group changes
exit
# SSH again
ssh -i "your-key.pem" ec2-user@your-ec2-public-dns

# Verify installation
docker --version
docker-compose --version
```

**For Ubuntu:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login
exit
# SSH again
```

#### Step 4: Clone and Setup Application

```bash
# Install Git
sudo yum install -y git  # Amazon Linux
# or
sudo apt install -y git  # Ubuntu

# Clone repository
cd ~
git clone <your-repo-url> PrepEasy
cd PrepEasy/backend

# Create production environment file
cat > .env << EOF
NODE_ENV=production
PORT=5001

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YourSecurePassword123!  # CHANGE THIS!
DB_DATABASE=interviewdock
DB_SYNCHRONIZE=true
DB_LOGGING=false

# CORS Configuration
CORS_ORIGIN=*

# Server Configuration
MAX_PAGE_SIZE=100
DEFAULT_PAGE_SIZE=20
EOF
```

**IMPORTANT**: Change `DB_PASSWORD` to a strong, unique password!

#### Step 5: Deploy with Docker

```bash
# Build and start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

You should see:
```
NAME                      STATUS
interviewdock-postgres    Up (healthy)
interviewdock-backend     Up
```

#### Step 6: Seed Database

```bash
# Run seed script
./scripts/docker-seed.sh

# Or manually
docker-compose exec backend npm run seed:prod
```

#### Step 7: Test Deployment

```bash
# From EC2 instance
curl http://localhost:5001/health
curl http://localhost:5001/api/categories

# From your local machine
curl http://your-ec2-public-ip:5001/health
curl http://your-ec2-public-ip:5001/api/categories
```

#### Docker Production Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update application (after git pull)
docker-compose down
docker-compose up -d --build

# Backup database
./scripts/db_backup/backup-db.sh

# Restore database
./scripts/db_backup/restore-db.sh backups/backup_file.sql.gz
```

---

### Option 2: AWS EC2 Native

Run Node.js and PostgreSQL directly without Docker.

#### Step 1-2: Same as Docker option above

#### Step 3: Install Node.js and PostgreSQL

**For Amazon Linux 2023:**
```bash
# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL 14
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
node --version
npm --version
psql --version
```

**For Ubuntu:**
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 14
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
node --version
npm --version
psql --version
```

#### Step 4: Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE interviewdock;
CREATE USER prepuser WITH PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE interviewdock TO prepuser;
\q

# Configure PostgreSQL to accept connections
sudo nano /var/lib/pgsql/data/pg_hba.conf  # Amazon Linux
# or
sudo nano /etc/postgresql/14/main/pg_hba.conf  # Ubuntu

# Add line:
# local   all   prepuser   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Step 5: Deploy Application

```bash
# Clone repository
cd ~
git clone <your-repo-url> PrepEasy
cd PrepEasy/backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=5001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=prepuser
DB_PASSWORD=YourSecurePassword123!
DB_DATABASE=interviewdock
DB_SYNCHRONIZE=true
DB_LOGGING=false

CORS_ORIGIN=*

MAX_PAGE_SIZE=100
DEFAULT_PAGE_SIZE=20
EOF

# Build TypeScript
npm run build

# Test
node dist/index.js
```

#### Step 6: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start dist/index.js --name interviewdock

# Setup auto-start on reboot
pm2 startup
# Follow the instructions printed

pm2 save

# Useful PM2 commands
pm2 status
pm2 logs interviewdock
pm2 restart interviewdock
pm2 stop interviewdock
pm2 delete interviewdock
```

#### Step 7: Seed Database

```bash
cd ~/PrepEasy/backend
npm run seed:prod
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

Vercel is optimized for React/Next.js applications and provides excellent DX.

#### Prerequisites
- GitHub account
- Your code pushed to GitHub
- Backend API deployed and accessible

#### Step 1: Prepare Frontend

1. **Update API URL** (if not using Vercel rewrites):

Create `frontend/.env.production`:
```bash
VITE_API_URL=http://your-ec2-ip:5001/api
```

Or use Vercel rewrites (recommended - see SSL section).

#### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure project:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variable:**
   - Go to project Settings → Environment Variables
   - Add:
     ```
     Name: VITE_API_URL
     Value: http://your-ec2-ip:5001/api
     ```
   - Or `/api` if using rewrites

6. **Click "Deploy"**

7. **Wait for deployment** (usually 1-2 minutes)

8. **Access your site** at the provided URL (e.g., `your-app.vercel.app`)

#### Step 3: Configure Custom Domain (Optional)

See [Custom Domain Configuration](#custom-domain-configuration) section below.

---

### Option 2: Netlify

#### Step 1: Prepare Frontend

Create `frontend/.env.production`:
```bash
VITE_API_URL=http://your-ec2-ip:5001/api
```

#### Step 2: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)** and sign in

2. **Click "Add new site" → "Import from Git"**

3. **Connect to GitHub** and select your repository

4. **Configure build:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

5. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add `VITE_API_URL`

6. **Click "Deploy site"**

7. **Access your site** at the provided URL

#### Step 3: Configure Custom Domain

See [Custom Domain Configuration](#custom-domain-configuration) section below.

---

### Option 3: Cloudflare Pages

Best if your domain is already on Cloudflare.

#### Step 1: Prepare Frontend

Same as Netlify above.

#### Step 2: Deploy to Cloudflare Pages

1. **Go to [dash.cloudflare.com](https://dash.cloudflare.com)**

2. **Pages → Create project → Connect to Git**

3. **Configure:**
   ```
   Framework preset: Vite
   Build command: cd frontend && npm run build
   Build output directory: frontend/dist
   Root directory: /
   ```

4. **Add Environment Variable:**
   ```
   VITE_API_URL = http://your-ec2-ip:5001/api
   ```

5. **Deploy**

---

## SSL/HTTPS Setup

Production sites should always use HTTPS. You have several options:

### Option 1: Vercel Rewrites (Easiest)

Use Vercel as a proxy to avoid mixed content issues.

**Update** `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://your-ec2-ip:5001/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Update environment variable in Vercel:**
```
VITE_API_URL=/api
```

**Pros**: Works immediately, HTTPS for free, no backend changes
**Cons**: All API calls go through Vercel

---

### Option 2: SSL on Backend (Recommended for Production)

Add HTTPS to your backend API using nginx and Let's Encrypt.

#### Prerequisites
- Domain or subdomain for API (e.g., `api.yourdomain.com`)
- A record pointing to your EC2 IP

#### Step 1: Setup Domain

Add DNS A record:
```
Type: A
Name: api
Value: your-ec2-ip
TTL: 600
```

#### Step 2: Install nginx and Certbot

**SSH to EC2:**

```bash
# Amazon Linux 2023
sudo yum install -y nginx certbot python3-certbot-nginx

# Ubuntu
sudo apt install -y nginx certbot python3-certbot-nginx

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 3: Configure nginx

```bash
sudo nano /etc/nginx/conf.d/api.conf
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 4: Get SSL Certificate

```bash
# Get certificate (follow prompts)
sudo certbot --nginx -d api.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

Certbot will automatically:
- Get a free SSL certificate
- Configure nginx to use HTTPS
- Setup auto-renewal

#### Step 5: Update Frontend Environment

Update your frontend environment variable:
```
VITE_API_URL=https://api.yourdomain.com/api
```

Redeploy frontend.

#### Step 6: Test

```bash
curl https://api.yourdomain.com/health
curl https://api.yourdomain.com/api/categories
```

---

### Option 3: Cloudflare Proxy

If using Cloudflare for DNS:

1. **Add A record:**
   ```
   Type: A
   Name: api
   Value: your-ec2-ip
   Proxy: ON (orange cloud)
   ```

2. **Cloudflare provides:**
   - Free SSL certificate
   - DDoS protection
   - CDN caching

3. **Update frontend:**
   ```
   VITE_API_URL=https://api.yourdomain.com/api
   ```

---

## Custom Domain Configuration

### For Vercel

#### Step 1: Add Domain in Vercel

1. Go to project Settings → Domains
2. Add your domain: `yourdomain.com` or `subdomain.yourdomain.com`
3. Vercel will show DNS records needed

#### Step 2: Update DNS

**For subdomain:**
```
Type: CNAME
Name: subdomain
Value: cname.vercel-dns.com
TTL: 600
```

**For root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

#### Step 3: Wait for DNS Propagation

Usually 5-30 minutes. Vercel will automatically get SSL certificate.

---

### For Netlify

#### Step 1: Add Domain

1. Site settings → Domain management → Add custom domain
2. Enter your domain

#### Step 2: Update DNS

Netlify will show exact records. Typically:
```
Type: CNAME
Name: subdomain
Value: your-site.netlify.app
TTL: 600
```

#### Step 3: SSL Certificate

Netlify provides free SSL automatically.

---

## Post-Deployment

### Security Checklist

- [ ] Change all default passwords
- [ ] Use strong database password
- [ ] Configure CORS properly (don't use `*` in production)
- [ ] Enable HTTPS everywhere
- [ ] Restrict EC2 security group rules
- [ ] Don't commit `.env` files to git
- [ ] Set `DB_SYNCHRONIZE=false` after first deploy
- [ ] Regular security updates
- [ ] Setup firewall on EC2

### Update CORS Origin

In backend `.env`:
```bash
# Instead of *
CORS_ORIGIN=https://yourdomain.com

# Multiple origins
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Disable Auto Schema Sync

After initial deployment, set in backend `.env`:
```bash
DB_SYNCHRONIZE=false
```

Use migrations for schema changes in production.

---

## Monitoring & Maintenance

### Backend Monitoring

**Check service status:**
```bash
# With Docker
docker-compose ps
docker-compose logs -f

# With PM2
pm2 status
pm2 logs interviewdock
```

**Check resource usage:**
```bash
# Docker
docker stats

# System
top
htop
df -h  # Disk usage
free -h  # Memory usage
```

### Database Backups

**Automated backups:**

```bash
# Setup cron job
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd ~/PrepEasy/backend && ./scripts/db_backup/backup-db.sh
```

**Manual backup:**
```bash
cd ~/PrepEasy/backend
./scripts/db_backup/backup-db.sh
```

**Restore:**
```bash
./scripts/db_backup/restore-db.sh backups/backup-file.sql.gz
```

See `backend/scripts/db_backup/Backup-Guide.md` for detailed backup procedures.

### Application Updates

**Pull latest code:**
```bash
cd ~/PrepEasy
git pull origin main
```

**Update backend:**
```bash
cd backend

# With Docker
docker-compose down
docker-compose up -d --build

# With PM2
npm install
npm run build
pm2 restart interviewdock
```

**Update frontend:**

Push changes to git, and Vercel/Netlify will auto-deploy.

Or manually trigger deployment in their dashboards.

### Logs

**Backend logs:**
```bash
# Docker
docker-compose logs -f backend

# PM2
pm2 logs interviewdock

# nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Frontend logs:**

Check Vercel/Netlify dashboard → Deployments → Build logs

### Health Checks

Setup monitoring service (UptimeRobot, Pingdom, etc.):

- Monitor: `https://yourdomain.com`
- Monitor: `https://api.yourdomain.com/health`
- Get alerts if site goes down

---

## Troubleshooting Production Issues

### Backend Not Responding

```bash
# Check if service is running
docker-compose ps
# or
pm2 status

# Check logs
docker-compose logs backend
# or
pm2 logs interviewdock

# Check port
sudo netstat -tlnp | grep 5001

# Restart service
docker-compose restart
# or
pm2 restart interviewdock
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres
# or
sudo systemctl status postgresql

# Check credentials in .env
# Try connecting manually
docker exec -it interviewdock-postgres psql -U postgres -d interviewdock
# or
psql -U prepuser -d interviewdock
```

### Frontend Can't Connect to Backend

1. **Check CORS:**
   - Backend logs will show CORS errors
   - Update `CORS_ORIGIN` in backend `.env`

2. **Check HTTPS/HTTP:**
   - Frontend (HTTPS) can't call backend (HTTP)
   - Use Vercel rewrites or add SSL to backend

3. **Check API URL:**
   - Verify `VITE_API_URL` environment variable
   - Redeploy frontend after changing

4. **Test API directly:**
   ```bash
   curl https://api.yourdomain.com/health
   ```

### SSL Certificate Issues

```bash
# Check certificate expiry
echo | openssl s_client -servername api.yourdomain.com -connect api.yourdomain.com:443 | openssl x509 -noout -dates

# Renew certificate
sudo certbot renew

# Check nginx config
sudo nginx -t
```

### Out of Disk Space

```bash
# Check usage
df -h

# Clean Docker
docker system prune -a

# Clean old logs
sudo truncate -s 0 /var/log/nginx/access.log
```

---

## Cost Estimation

### Budget-Friendly Setup (Recommended)

- **EC2 t2.micro**: ~$8-10/month (free tier eligible)
- **Vercel/Netlify**: Free tier (sufficient for most cases)
- **Domain**: ~$10-15/year
- **SSL**: Free (Let's Encrypt or Vercel/Netlify)

**Total**: ~$10-15/month (+domain cost)

### Scaling Up

When you need more resources:
- Upgrade EC2 to t2.small or t2.medium
- Add RDS for managed PostgreSQL
- Use CloudFront CDN
- Add load balancer for high availability

---

## Next Steps

After deployment:

1. **Test thoroughly:**
   - All API endpoints
   - Frontend functionality
   - Create/Read/Update/Delete operations

2. **Setup monitoring:**
   - Uptime monitoring
   - Error tracking (Sentry, LogRocket)
   - Analytics (Google Analytics, Plausible)

3. **Setup automated backups:**
   - Daily database backups
   - Test restore procedures

4. **Document your setup:**
   - Server details
   - DNS configuration
   - Credentials (in password manager)

5. **Plan for updates:**
   - Regular security updates
   - Feature deployments
   - Database migrations

---

## Additional Resources

- **Local Development**: See `LOCAL-DEVELOPMENT.md`
- **API Reference**: See `API-DOCUMENTATION.md`
- **Database Backups**: See `backend/scripts/db_backup/Backup-Guide.md`
- **Main README**: See `README.md`

---

## Support

If you encounter issues not covered here:

1. Check application logs first
2. Review security group and firewall settings  
3. Verify all environment variables
4. Test API endpoints individually
5. Check DNS propagation status
