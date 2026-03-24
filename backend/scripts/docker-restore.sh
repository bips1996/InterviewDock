#!/bin/bash

# Docker Database Restore Script for InterviewDock
# Restores database from a backup file in a Docker environment
# This script can be run from the host to restore the database in Docker

set -e

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: ./docker-restore.sh <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh backups/ 2>/dev/null || echo "No backups directory found"
    echo ""
    echo "Example:"
    echo "  ./docker-restore.sh backups/interviewdock_backup_20260324_032628.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

# Set defaults
DB_USERNAME=${DB_USERNAME:-postgres}
DB_DATABASE=${DB_DATABASE:-interviewdock}
DB_PASSWORD=${DB_PASSWORD:-postgres}
CONTAINER_NAME=${POSTGRES_CONTAINER:-interviewdock-postgres}

echo "📦 InterviewDock Database Restore"
echo "=================================="
echo "Backup file: $BACKUP_FILE"
echo "Container: $CONTAINER_NAME"
echo "Database: $DB_DATABASE"
echo "User: $DB_USERNAME"
echo ""
echo "⚠️  WARNING: This will restore data into the current database!"
echo "   Make sure you have a recent backup before proceeding."
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Error: Container $CONTAINER_NAME is not running"
    echo "   Start it with: docker-compose up -d postgres"
    exit 1
fi

echo ""
echo "🗄️  Starting database restore..."

# Decompress and restore based on file type
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "📦 Decompressing and restoring backup..."
    gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql \
        -U "$DB_USERNAME" \
        -d "$DB_DATABASE" \
        2>&1 | grep -v "ERROR.*already exists" | grep -v "WARNING" || true
else
    echo "📦 Restoring backup..."
    docker exec -i "$CONTAINER_NAME" psql \
        -U "$DB_USERNAME" \
        -d "$DB_DATABASE" \
        < "$BACKUP_FILE" \
        2>&1 | grep -v "ERROR.*already exists" | grep -v "WARNING" || true
fi

echo ""
echo "✅ Database restored successfully!"
echo ""
echo "📊 Verifying restore..."
CATEGORY_COUNT=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USERNAME" -d "$DB_DATABASE" -t -c "SELECT COUNT(*) FROM categories;" 2>/dev/null | xargs || echo "0")
TECH_COUNT=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USERNAME" -d "$DB_DATABASE" -t -c "SELECT COUNT(*) FROM technologies;" 2>/dev/null | xargs || echo "0")
QUESTION_COUNT=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USERNAME" -d "$DB_DATABASE" -t -c "SELECT COUNT(*) FROM questions;" 2>/dev/null | xargs || echo "0")

echo "Categories: $CATEGORY_COUNT"
echo "Technologies: $TECH_COUNT"
echo "Questions: $QUESTION_COUNT"
echo ""
echo "✨ Restore complete! You may need to restart the backend container:"
echo "   docker-compose restart backend"
