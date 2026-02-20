#!/bin/bash

# Database Backup Script for InterviewDock
# Creates a timestamped backup of the PostgreSQL database

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/interviewdock_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🗄️  Starting database backup..."

# Create backup using docker exec
docker exec interviewdock-postgres pg_dump \
    -U ${DB_USERNAME:-postgres} \
    -d ${DB_DATABASE:-interviewdock} \
    > "$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_FILE"

echo "✅ Backup created: ${BACKUP_FILE}.gz"
echo "📦 Backup size: $(du -h ${BACKUP_FILE}.gz | cut -f1)"

# Optional: Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
ls -t $BACKUP_DIR/interviewdock_backup_*.sql.gz | tail -n +8 | xargs -r rm

echo "✅ Backup completed successfully!"
