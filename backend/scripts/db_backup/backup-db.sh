#!/bin/bash

# Database Backup Script for InterviewDock
# Creates backups of the PostgreSQL database running in Docker container
# Supports both development and production environments

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Parse command line arguments
ENV_FILE=".env"
NO_COMPRESS=false
KEEP_BACKUPS=7

while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENV_FILE="$2"
            shift 2
            ;;
        --prod|--production)
            ENV_FILE=".env.production"
            shift
            ;;
        --no-compress)
            NO_COMPRESS=true
            shift
            ;;
        --keep)
            KEEP_BACKUPS="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --env FILE            Use specific env file (default: .env)"
            echo "  --prod, --production  Use .env.production file"
            echo "  --no-compress         Skip compression (faster, larger files)"
            echo "  --keep N              Keep last N backups (default: 7)"
            echo "  --help                Show this help message"
            echo ""
            echo "Example:"
            echo "  $0                    # Create backup for dev"
            echo "  $0 --prod --keep 30   # Create production backup, keep 30"
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
        *)
            print_error "Unexpected argument: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Change to script directory
cd "$(dirname "$0")/.."

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    print_info "Loading environment from $ENV_FILE"
    export $(cat "$ENV_FILE" | grep -v '^#' | grep -v '^$' | xargs)
else
    print_warning "Environment file $ENV_FILE not found, using defaults"
fi

# Configuration
CONTAINER_NAME="${POSTGRES_CONTAINER:-interviewdock-postgres}"
DB_USER="${DB_USERNAME:-postgres}"
DB_NAME="${DB_DATABASE:-interviewdock}"
BACKUP_DIR="../backups"

print_info "Container: $CONTAINER_NAME"
print_info "Database: $DB_NAME"

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_error "Container '$CONTAINER_NAME' is not running!"
    print_info "Available containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}"
    exit 1
fi

print_success "Container is running"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/interviewdock_backup_${TIMESTAMP}.sql"

print_info "Starting database backup..."

# Create backup using pg_dump with --clean flag to include DROP statements
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists > "$BACKUP_FILE"; then
    print_success "Database dump created"
else
    print_error "Database backup failed!"
    exit 1
fi

# Compress backup if requested
if [ "$NO_COMPRESS" = false ]; then
    print_info "Compressing backup..."
    if gzip "$BACKUP_FILE"; then
        BACKUP_FILE="${BACKUP_FILE}.gz"
        print_success "Backup compressed"
    else
        print_warning "Compression failed, keeping uncompressed backup"
    fi
fi

# Get backup file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
print_success "Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# Clean up old backups
if [ "$KEEP_BACKUPS" -gt 0 ]; then
    print_info "Cleaning up old backups (keeping last $KEEP_BACKUPS)..."
    BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}"/interviewdock_backup_*.sql* 2>/dev/null | wc -l)
    
    if [ "$BACKUP_COUNT" -gt "$KEEP_BACKUPS" ]; then
        ls -1t "${BACKUP_DIR}"/interviewdock_backup_*.sql* | tail -n +$((KEEP_BACKUPS + 1)) | xargs rm -f
        REMOVED=$((BACKUP_COUNT - KEEP_BACKUPS))
        print_success "Removed $REMOVED old backup(s)"
    fi
fi

# Show current backups
print_info "Current backups:"
ls -lh "${BACKUP_DIR}"/ | tail -n +2

print_success "Backup completed successfully!"
echo ""
print_info "To restore this backup, run:"
echo "  ./scripts/db_backup/restore-db.sh $BACKUP_FILE"
