#!/bin/bash

# Verify database backup integrity for InterviewDock
# Checks if backup file is valid and can be read

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

while [[ $# -gt 0 ]]; do
    case $1 in
        --help)
            echo "Usage: $0 <backup_file>"
            echo ""
            echo "Verifies the integrity of a database backup file."
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

echo ""
print_info "Database Backup Integrity Verification"
echo ""

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    print_error "No backup file specified!"
    echo ""
    echo "Usage: $0 <backup_file>"
    echo ""
    print_info "Available backups:"
    if [ -d "./backups" ] && [ "$(ls -A ./backups 2>/dev/null)" ]; then
        ls -lh backups/ | tail -n +2
    else
        print_warning "No backups found in ./backups directory"
    fi
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

print_success "Backup file found: $BACKUP_FILE"

# Get file information
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
FILE_DATE=$(stat -c '%y' "$BACKUP_FILE" 2>/dev/null | cut -d'.' -f1 || stat -f '%Sm' "$BACKUP_FILE" 2>/dev/null)

print_info "File size: $FILE_SIZE"
print_info "Created: $FILE_DATE"

# Verify file integrity
echo ""
print_info "Checking file integrity..."

if [[ $BACKUP_FILE == *.gz ]]; then
    # Test gzip file integrity
    if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
        print_success "Compression integrity: OK"
    else
        print_error "Compression integrity: FAILED"
        print_error "The gzip file appears to be corrupted!"
        exit 1
    fi
    
    # Check if it's a valid SQL dump
    print_info "Checking SQL content..."
    if gunzip -c "$BACKUP_FILE" | head -n 100 | grep -q "PostgreSQL database dump"; then
        print_success "SQL format: Valid PostgreSQL dump"
    else
        print_warning "SQL format: Unable to verify (might still be valid)"
    fi
    
    # Show first few lines
    echo ""
    print_info "First lines of backup:"
    echo "─────────────────────────────────────────────────────"
    gunzip -c "$BACKUP_FILE" | head -n 10 | sed 's/^/  /'
    echo "─────────────────────────────────────────────────────"
    
else
    # For uncompressed SQL files
    if [ -r "$BACKUP_FILE" ]; then
        print_success "File is readable"
    else
        print_error "File is not readable!"
        exit 1
    fi
    
    # Check if it's a valid SQL dump
    print_info "Checking SQL content..."
    if head -n 100 "$BACKUP_FILE" | grep -q "PostgreSQL database dump"; then
        print_success "SQL format: Valid PostgreSQL dump"
    else
        print_warning "SQL format: Unable to verify (might still be valid)"
    fi
    
    # Show first few lines
    echo ""
    print_info "First lines of backup:"
    echo "─────────────────────────────────────────────────────"
    head -n 10 "$BACKUP_FILE" | sed 's/^/  /'
    echo "─────────────────────────────────────────────────────"
fi

# Count lines (approximate content size)
echo ""
print_info "Analyzing backup content..."

if [[ $BACKUP_FILE == *.gz ]]; then
    LINE_COUNT=$(gunzip -c "$BACKUP_FILE" | wc -l)
else
    LINE_COUNT=$(wc -l < "$BACKUP_FILE")
fi

print_info "Total lines: $LINE_COUNT"

# Look for key SQL commands
if [[ $BACKUP_FILE == *.gz ]]; then
    CREATE_COUNT=$(gunzip -c "$BACKUP_FILE" | grep -c "^CREATE" || true)
    INSERT_COUNT=$(gunzip -c "$BACKUP_FILE" | grep -c "^INSERT\|^COPY" || true)
else
    CREATE_COUNT=$(grep -c "^CREATE" "$BACKUP_FILE" || true)
    INSERT_COUNT=$(grep -c "^INSERT\|^COPY" "$BACKUP_FILE" || true)
fi

print_info "CREATE statements: $CREATE_COUNT"
print_info "Data insertion statements: $INSERT_COUNT"

# Final verdict
echo ""
if [ "$LINE_COUNT" -gt 10 ] && [ "$CREATE_COUNT" -gt 0 ]; then
    print_success "========================================="
    print_success "Backup appears to be VALID and COMPLETE"
    print_success "========================================="
    echo ""
    print_info "You can restore this backup using:"
    echo "    ./scripts/restore-db.sh $BACKUP_FILE"
else
    print_warning "========================================="
    print_warning "Backup may be INCOMPLETE or EMPTY"
    print_warning "========================================="
    echo ""
    print_warning "Please verify manually before using this backup"
fi

echo ""
