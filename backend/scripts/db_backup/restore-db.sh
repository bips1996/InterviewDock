#!/bin/bash

# Database Restore Script for InterviewDock
# Restores database from a backup file

set -e

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: ./restore-db.sh <backup_file.sql.gz>"
    echo "Available backups:"
    ls -lh backups/
    exit 1
fi

BACKUP_FILE=$1

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "⚠️  WARNING: This will overwrite the current database!"
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

echo "🗄️  Starting database restore..."

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "📦 Decompressing backup..."
    gunzip -c "$BACKUP_FILE" | docker exec -i interviewdock-postgres psql \
        -U ${DB_USERNAME:-postgres} \
        -d ${DB_DATABASE:-interviewdock}
else
    docker exec -i interviewdock-postgres psql \
        -U ${DB_USERNAME:-postgres} \
        -d ${DB_DATABASE:-interviewdock} \
        < "$BACKUP_FILE"
fi

echo "✅ Database restored successfully!"
