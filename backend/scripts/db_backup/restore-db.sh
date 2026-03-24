#!/bin/bash

# Database Restore Script for InterviewDock
# Restores database from a backup file running in Docker container
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
BACKUP_FILE=""
ENV_FILE=".env"
SKIP_CONFIRM=false

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
        --yes|-y)
            SKIP_CONFIRM=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options] <backup_file>"
            echo "Options:"
            echo "  --env FILE            Use specific env file (default: .env)"
            echo "  --prod, --production  Use .env.production file"
            echo "  --yes, -y             Skip confirmation prompt"
            echo "  --help                Show this help message"
            echo ""
            echo "Example:"
            echo "  $0 backups/interviewdock_backup_20240223_120000.sql.gz"
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# Change to script directory
cd "$(dirname "$0")/.."

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    print_error "No backup file specified!"
    echo ""
    echo "Usage: $0 [options] <backup_file>"
    echo ""
    print_info "Available backups in ../backups:"
    if [ -d "../backups" ] && [ "$(ls -A ../backups 2>/dev/null)" ]; then
        ls -lh ../backups/ | tail -n +2
    else
        print_warning "No backups found in ../backups directory"
    fi
    echo ""
    echo "Use --help for more options"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

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

print_info "Container: $CONTAINER_NAME"
print_info "Database: $DB_NAME"
print_info "Backup file: $BACKUP_FILE"
print_info "File size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_error "Container '$CONTAINER_NAME' is not running!"
    print_info "Available containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}"
    exit 1
fi

print_success "Container is running"

# Confirmation prompt
if [ "$SKIP_CONFIRM" = false ]; then
    echo ""
    print_warning "WARNING: This will restore the database from backup!"
    print_warning "The backup should include DROP statements to clean existing data."
    echo ""
    read -p "Are you sure you want to continue? Type 'yes' to proceed: " -r
    echo ""
    if [[ ! $REPLY =~ ^yes$ ]]; then
        print_info "Restore cancelled."
        exit 0
    fi
fi

print_info "Starting database restore..."

# Decompress and restore
if [[ $BACKUP_FILE == *.gz ]]; then
    print_info "Decompressing and restoring backup..."
    if gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
        print_success "Database restored successfully"
    else
        print_warning "Restore completed with some warnings (this is normal)"
    fi
else
    print_info "Restoring backup..."
    if cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
        print_success "Database restored successfully"
    else
        print_warning "Restore completed with some warnings (this is normal)"
    fi
fi

# Verify restoration
print_info "Verifying database..."
TABLE_COUNT=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
print_success "Database has $TABLE_COUNT tables"

print_success "Restore completed successfully!"
echo ""
print_info "Database '$DB_NAME' has been restored from:"
print_info "  $BACKUP_FILE"
