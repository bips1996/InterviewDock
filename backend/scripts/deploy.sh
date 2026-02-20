#!/bin/bash

# InterviewDock Production Deployment Script
# This script provides one-click deployment for production

set -e  # Exit on any error

echo "🚀 InterviewDock Production Deployment"
echo "======================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.production template...${NC}"
    cp .env.production .env
    echo -e "${RED}❌ Please update .env file with your production credentials and run again!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Stop existing containers
echo ""
echo "📦 Stopping existing containers..."
docker-compose down || true

# Remove old images (optional, comment out if you want to keep them)
# echo "🗑️  Removing old images..."
# docker-compose down --rmi all || true

# Build and start services
echo ""
echo "🔨 Building production images..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker ps | grep -q "interviewdock-backend"; then
    echo -e "${GREEN}✅ Backend service is running${NC}"
else
    echo -e "${RED}❌ Backend service failed to start${NC}"
    docker-compose logs backend
    exit 1
fi

if docker ps | grep -q "interviewdock-postgres"; then
    echo -e "${GREEN}✅ Database service is running${NC}"
else
    echo -e "${RED}❌ Database service failed to start${NC}"
    docker-compose logs postgres
    exit 1
fi

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose ps

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📍 Your application is now running at:"
echo "   - Backend API: http://localhost:5001/api"
echo "   - Database: localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo "   - View backend logs: docker-compose logs -f backend"
echo "   - View database logs: docker-compose logs -f postgres"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo "   1. Set up a reverse proxy (nginx/traefik)"
echo "   2. Configure SSL certificates"
echo "   3. Set up database backups"
echo "   4. Configure firewall rules"
echo ""
