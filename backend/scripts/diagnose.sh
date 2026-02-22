#!/bin/bash

# Diagnostics Script for InterviewDock Backend on EC2
# Run this script to diagnose issues with the application

echo "🔍 InterviewDock Backend - Diagnostics"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}## $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. System Information
print_header "System Information"
echo "OS: $(uname -s)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo ""

# 2. Node.js Version
print_header "Node.js"
if command -v node &> /dev/null; then
    print_success "Node.js $(node -v)"
    echo "npm: $(npm -v)"
else
    print_error "Node.js not installed"
fi
echo ""

# 3. PostgreSQL
print_header "PostgreSQL"
if command -v psql &> /dev/null; then
    print_success "PostgreSQL $(psql --version | awk '{print $3}')"
    
    # Check if PostgreSQL service is running
    if systemctl is-active --quiet postgresql; then
        print_success "PostgreSQL service is running"
    else
        print_error "PostgreSQL service is NOT running"
        echo "Start with: sudo systemctl start postgresql"
    fi
else
    print_error "PostgreSQL not installed"
fi
echo ""

# 4. Environment Configuration
print_header "Environment Configuration"
if [ -f ".env" ]; then
    print_success ".env file exists"
    echo ""
    echo "Configuration:"
    echo "  NODE_ENV: ${NODE_ENV:-not set}"
    echo "  PORT: ${PORT:-not set}"
    echo "  DB_HOST: ${DB_HOST:-not set}"
    echo "  DB_PORT: ${DB_PORT:-not set}"
    echo "  DB_DATABASE: ${DB_DATABASE:-not set}"
    echo "  DB_USERNAME: ${DB_USERNAME:-not set}"
    echo "  DB_SYNCHRONIZE: ${DB_SYNCHRONIZE:-not set}"
    echo "  DB_LOGGING: ${DB_LOGGING:-not set}"
    
    if [ -f ".env" ]; then
        source .env
    fi
else
    print_error ".env file not found"
    echo "Create one with: cp .env.production .env"
fi
echo ""

# 5. Application Build
print_header "Application Build"
if [ -d "dist" ]; then
    print_success "dist/ directory exists"
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "  Files in dist/: $FILE_COUNT"
    
    if [ -f "dist/index.js" ]; then
        print_success "dist/index.js exists"
    else
        print_error "dist/index.js not found"
        echo "Build with: npm run build"
    fi
else
    print_error "dist/ directory not found"
    echo "Build with: npm run build"
fi
echo ""

# 6. Database Connection
print_header "Database Connection"
if [ -n "$DB_HOST" ] && [ -n "$DB_USERNAME" ] && [ -n "$DB_DATABASE" ]; then
    if psql -h ${DB_HOST} -U ${DB_USERNAME} -d postgres -c "\q" 2>/dev/null; then
        print_success "Can connect to PostgreSQL server"
        
        # Check if target database exists
        DB_EXISTS=$(psql -h ${DB_HOST} -U ${DB_USERNAME} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_DATABASE}'" 2>/dev/null)
        if [ "$DB_EXISTS" == "1" ]; then
            print_success "Database '${DB_DATABASE}' exists"
        else
            print_error "Database '${DB_DATABASE}' does not exist"
            echo "Create with: psql -h ${DB_HOST} -U ${DB_USERNAME} -d postgres -c \"CREATE DATABASE ${DB_DATABASE};\""
        fi
    else
        print_error "Cannot connect to PostgreSQL"
        echo "Check credentials and ensure PostgreSQL is running"
    fi
else
    print_warning "Database configuration not loaded"
fi
echo ""

# 7. Database Tables
print_header "Database Tables"
if [ -n "$DB_HOST" ] && [ -n "$DB_USERNAME" ] && [ -n "$DB_DATABASE" ]; then
    TABLES=$(psql -h ${DB_HOST} -U ${DB_USERNAME} -d ${DB_DATABASE} -tAc "\dt" 2>/dev/null | wc -l)
    
    if [ "$TABLES" -gt 0 ]; then
        print_success "Database has tables"
        echo ""
        psql -h ${DB_HOST} -U ${DB_USERNAME} -d ${DB_DATABASE} -c "\dt" 2>/dev/null || echo "Could not list tables"
        echo ""
        
        # Check specific tables
        for table in categories technologies questions tags question_tags; do
            COUNT=$(psql -h ${DB_HOST} -U ${DB_USERNAME} -d ${DB_DATABASE} -tAc "SELECT COUNT(*) FROM $table" 2>/dev/null)
            if [ $? -eq 0 ]; then
                if [ "$COUNT" -gt 0 ]; then
                    print_success "$table: $COUNT rows"
                else
                    print_warning "$table: empty (0 rows)"
                fi
            else
                print_error "$table: table does not exist"
            fi
        done
    else
        print_error "No tables found in database"
        echo "Tables may not have been created. Check DB_SYNCHRONIZE setting."
        echo "Current DB_SYNCHRONIZE: ${DB_SYNCHRONIZE:-not set}"
        echo ""
        echo "If DB_SYNCHRONIZE is false, set it to true and restart the server."
    fi
else
    print_warning "Cannot check tables - database configuration not loaded"
fi
echo ""

# 8. PM2 Status
print_header "PM2 Status"
if command -v pm2 &> /dev/null; then
    print_success "PM2 installed"
    echo ""
    pm2 list
    echo ""
    
    if pm2 list | grep -q "interviewdock-backend"; then
        if pm2 list | grep -q "interviewdock-backend.*online"; then
            print_success "Application is running"
        else
            print_error "Application is not online"
            echo "Check logs with: pm2 logs interviewdock-backend"
        fi
    else
        print_warning "Application not found in PM2"
        echo "Start with: pm2 start dist/index.js --name interviewdock-backend"
    fi
else
    print_warning "PM2 not installed"
    echo "Install with: sudo npm install -g pm2"
fi
echo ""

# 9. Port Status
print_header "Port Status"
if [ -n "$PORT" ]; then
    if lsof -i:${PORT} > /dev/null 2>&1; then
        print_success "Port ${PORT} is in use"
        echo "Process using port ${PORT}:"
        lsof -i:${PORT}
    else
        print_warning "Port ${PORT} is not in use"
        echo "Application may not be running"
    fi
else
    print_warning "PORT not configured"
fi
echo ""

# 10. API Health Check
print_header "API Health Check"
if [ -n "$PORT" ]; then
    HEALTH_URL="http://localhost:${PORT}/health"
    echo "Testing: $HEALTH_URL"
    
    HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" ${HEALTH_URL} 2>/dev/null)
    HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" == "200" ]; then
        print_success "Health endpoint responding (HTTP 200)"
        echo "Response: $RESPONSE_BODY"
    else
        print_error "Health endpoint failed (HTTP $HTTP_CODE)"
    fi
else
    print_warning "Cannot test - PORT not configured"
fi
echo ""

# 11. API Questions Endpoint
print_header "API Questions Endpoint"
if [ -n "$PORT" ]; then
    QUESTIONS_URL="http://localhost:${PORT}/api/questions?page=1&limit=1"
    echo "Testing: $QUESTIONS_URL"
    
    QUESTIONS_RESPONSE=$(curl -s ${QUESTIONS_URL} 2>/dev/null)
    
    if echo "$QUESTIONS_RESPONSE" | grep -q "success"; then
        print_success "Questions endpoint responding"
        
        if command -v jq &> /dev/null; then
            TITLE=$(echo "$QUESTIONS_RESPONSE" | jq -r '.data.items[0].title' 2>/dev/null)
            TOTAL=$(echo "$QUESTIONS_RESPONSE" | jq -r '.pagination.total' 2>/dev/null)
            
            echo "Total questions: $TOTAL"
            echo "First question title: $TITLE"
            
            if [ "$TITLE" != "null" ] && [ -n "$TITLE" ]; then
                print_success "Question data is valid"
            else
                print_error "Question title is null"
                echo "This indicates a data or query issue"
            fi
        else
            echo "Response (install jq for better formatting):"
            echo "$QUESTIONS_RESPONSE" | head -c 500
        fi
    elif echo "$QUESTIONS_RESPONSE" | grep -q "error"; then
        print_error "Questions endpoint returned an error"
        echo "Response: $QUESTIONS_RESPONSE"
    else
        print_error "Questions endpoint not responding correctly"
        echo "Response: $QUESTIONS_RESPONSE"
    fi
else
    print_warning "Cannot test - PORT not configured"
fi
echo ""

# 12. Recent Logs
print_header "Recent Application Logs (PM2)"
if command -v pm2 &> /dev/null && pm2 list | grep -q "interviewdock-backend"; then
    echo "Last 30 lines of logs:"
    echo ""
    pm2 logs interviewdock-backend --lines 30 --nostream
else
    print_warning "PM2 not running or application not found"
fi
echo ""

# Summary
print_header "Summary & Recommendations"
echo ""

ISSUES=0

# Check critical issues
if ! command -v node &> /dev/null; then
    print_error "Install Node.js 18+"
    ((ISSUES++))
fi

if ! command -v psql &> /dev/null; then
    print_error "Install PostgreSQL"
    ((ISSUES++))
fi

if [ ! -f ".env" ]; then
    print_error "Create .env file: cp .env.production .env"
    ((ISSUES++))
fi

if [ ! -f "dist/index.js" ]; then
    print_error "Build application: npm run build"
    ((ISSUES++))
fi

if [ -n "$DB_HOST" ] && [ -n "$DB_USERNAME" ] && [ -n "$DB_DATABASE" ]; then
    QUESTION_COUNT=$(psql -h ${DB_HOST} -U ${DB_USERNAME} -d ${DB_DATABASE} -tAc "SELECT COUNT(*) FROM questions" 2>/dev/null || echo "0")
    if [ "$QUESTION_COUNT" == "0" ]; then
        print_warning "Database is empty - run: npm run seed"
        ((ISSUES++))
    fi
fi

if [ $ISSUES -eq 0 ]; then
    print_success "No critical issues found!"
else
    echo ""
    print_warning "Found $ISSUES issue(s) - please address them above"
fi

echo ""
echo "=================================="
echo "Diagnostics complete!"
echo "=================================="
