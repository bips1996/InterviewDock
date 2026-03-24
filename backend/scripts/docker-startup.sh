#!/bin/sh

# Docker startup script for InterviewDock backend
# This script runs migrations, optionally restores from backup, and then starts the server

set -e

echo "🚀 Starting InterviewDock Backend..."

# Wait a bit for postgres to be fully ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "📦 Running database migrations..."
npm run migration:run || echo "⚠️  No pending migrations or migrations failed"

# Check if we should restore from backup
if [ -n "${RESTORE_BACKUP}" ] && [ "${RESTORE_BACKUP}" != "false" ]; then
    BACKUP_FILE="${RESTORE_BACKUP}"
    
    echo "🗄️  Restoring database from backup: ${BACKUP_FILE}"
    
    if [ -f "${BACKUP_FILE}" ]; then
        # Decompress and restore
        if [[ "${BACKUP_FILE}" == *.gz ]]; then
            echo "📦 Decompressing and restoring backup..."
            gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${DB_PASSWORD}" psql \
                -h "${DB_HOST}" \
                -p "${DB_PORT:-5432}" \
                -U "${DB_USERNAME}" \
                -d "${DB_DATABASE}" \
                2>&1 | grep -v "ERROR.*already exists" || true
        else
            echo "📦 Restoring backup..."
            PGPASSWORD="${DB_PASSWORD}" psql \
                -h "${DB_HOST}" \
                -p "${DB_PORT:-5432}" \
                -U "${DB_USERNAME}" \
                -d "${DB_DATABASE}" \
                < "${BACKUP_FILE}" \
                2>&1 | grep -v "ERROR.*already exists" || true
        fi
        echo "✅ Backup restored successfully"
    else
        echo "⚠️  Backup file not found: ${BACKUP_FILE}"
        echo "   Continuing without backup restore."
    fi
fi

# Start the server
echo "🚀 Starting server..."
exec node dist/index.js
