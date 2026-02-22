#!/bin/bash

# EC2 Quick Setup Script for InterviewDock Backend
# This script automates the initial deployment on EC2

set -e  # Exit on error

echo "🚀 InterviewDock Backend - EC2 Setup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if running on EC2
print_info "Checking environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js $NODE_VERSION found"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

print_success "PostgreSQL found"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_info "Creating .env file from .env.production..."
    cp .env.production .env
    print_success ".env file created"
    print_info "⚠️  Please edit .env file and update DB_PASSWORD before continuing!"
    echo ""
    echo "Run: nano .env"
    echo "Then run this script again."
    exit 0
fi

# Load environment variables
source .env

# Check if DB_PASSWORD has been changed
if [ "$DB_PASSWORD" == "CHANGE_THIS_SECURE_PASSWORD" ]; then
    print_error "Please update DB_PASSWORD in .env file before running this script!"
    echo "Run: nano .env"
    exit 1
fi

print_success ".env file configured"

# Install dependencies
print_info "Installing Node.js dependencies..."
npm install
print_success "Dependencies installed"

# Build application
print_info "Building TypeScript application..."
npm run build
print_success "Application built successfully"

# Test database connection
print_info "Testing database connection..."
if psql -h ${DB_HOST:-localhost} -U ${DB_USERNAME:-postgres} -d postgres -c "\q" 2>/dev/null; then
    print_success "Database connection successful"
else
    print_error "Cannot connect to database. Please check your configuration."
    echo ""
    echo "Database Configuration:"
    echo "  Host: ${DB_HOST:-localhost}"
    echo "  Port: ${DB_PORT:-5432}"
    echo "  Username: ${DB_USERNAME:-postgres}"
    echo "  Database: ${DB_DATABASE:-interviewdock}"
    echo ""
    echo "Please ensure PostgreSQL is running and credentials are correct."
    exit 1
fi

# Check if database exists
DB_EXISTS=$(psql -h ${DB_HOST:-localhost} -U ${DB_USERNAME:-postgres} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_DATABASE:-interviewdock}'")

if [ "$DB_EXISTS" != "1" ]; then
    print_info "Creating database ${DB_DATABASE:-interviewdock}..."
    psql -h ${DB_HOST:-localhost} -U ${DB_USERNAME:-postgres} -d postgres -c "CREATE DATABASE ${DB_DATABASE:-interviewdock};"
    print_success "Database created"
else
    print_success "Database ${DB_DATABASE:-interviewdock} already exists"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_info "PM2 not found. Installing PM2 globally..."
    sudo npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Stop existing PM2 process if running
if pm2 list | grep -q "interviewdock-backend"; then
    print_info "Stopping existing PM2 process..."
    pm2 stop interviewdock-backend
    pm2 delete interviewdock-backend
fi

# Start application with PM2
print_info "Starting application with PM2..."
pm2 start dist/index.js --name "interviewdock-backend"
print_success "Application started"

# Wait for application to start
print_info "Waiting for application to start..."
sleep 5

# Check if application is running
if pm2 list | grep -q "interviewdock-backend.*online"; then
    print_success "Application is running"
else
    print_error "Application failed to start. Check logs with: pm2 logs interviewdock-backend"
    exit 1
fi

# Check if database needs seeding
print_info "Checking if database needs seeding..."
QUESTION_COUNT=$(psql -h ${DB_HOST:-localhost} -U ${DB_USERNAME:-postgres} -d ${DB_DATABASE:-interviewdock} -tAc "SELECT COUNT(*) FROM questions" 2>/dev/null || echo "0")

if [ "$QUESTION_COUNT" == "0" ]; then
    print_info "Database is empty. Running seed script..."
    npm run seed
    print_success "Database seeded successfully"
else
    print_success "Database already has $QUESTION_COUNT questions"
fi

# Save PM2 configuration
print_info "Saving PM2 configuration..."
pm2 save
print_success "PM2 configuration saved"

# Test API endpoints
print_info "Testing API endpoints..."

# Test health endpoint
if curl -s http://localhost:${PORT:-5001}/health | grep -q "ok"; then
    print_success "Health endpoint working"
else
    print_error "Health endpoint failed"
fi

# Test questions endpoint
QUESTION_RESPONSE=$(curl -s "http://localhost:${PORT:-5001}/api/questions?page=1&limit=1")
if echo "$QUESTION_RESPONSE" | grep -q "success"; then
    print_success "Questions endpoint working"
    
    # Check if title is not null
    if command -v jq &> /dev/null; then
        TITLE=$(echo "$QUESTION_RESPONSE" | jq -r '.data.items[0].title')
        if [ "$TITLE" != "null" ] && [ -n "$TITLE" ]; then
            print_success "Question title retrieved: $TITLE"
        else
            print_error "Question title is null or empty"
            print_info "This might indicate a data issue. Check: pm2 logs interviewdock-backend"
        fi
    fi
else
    print_error "Questions endpoint failed"
    echo "Response: $QUESTION_RESPONSE"
fi

# Final summary
echo ""
echo "======================================"
print_success "Setup completed successfully!"
echo "======================================"
echo ""
echo "📊 Application Status:"
echo "  - Application: Running (PM2)"
echo "  - Port: ${PORT:-5001}"
echo "  - Database: ${DB_DATABASE:-interviewdock}"
echo "  - Questions in DB: $QUESTION_COUNT"
echo ""
echo "🔗 Endpoints:"
echo "  - Health: http://localhost:${PORT:-5001}/health"
echo "  - API: http://localhost:${PORT:-5001}/api"
echo "  - Questions: http://localhost:${PORT:-5001}/api/questions"
echo ""
echo "📝 Useful Commands:"
echo "  - View logs: pm2 logs interviewdock-backend"
echo "  - Restart: pm2 restart interviewdock-backend"
echo "  - Stop: pm2 stop interviewdock-backend"
echo "  - Monitor: pm2 monit"
echo ""
echo "⚠️  Next Steps:"
echo "  1. Setup PM2 to start on boot: pm2 startup"
echo "  2. Configure firewall to allow port ${PORT:-5001}"
echo "  3. Set DB_SYNCHRONIZE=false in .env after confirming everything works"
echo "  4. Setup Nginx reverse proxy (optional)"
echo ""
print_success "Deployment complete! 🎉"
