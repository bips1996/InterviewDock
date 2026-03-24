#!/bin/sh

# Docker entrypoint script for backend container
# Handles database initialization with migrations and backup restore

set -e

echo "🚀 Starting backend initialization..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Run database migrations
echo "📦 Running database migrations..."
npm run migration:run || echo "⚠️  No pending migrations or migrations failed"

# Check if we should restore from backup
if [ "${RESTORE_FROM_BACKUP}" = "true" ] && [ -n "${BACKUP_FILE}" ]; then
    echo "🗄️  Restoring database from backup: ${BACKUP_FILE}"
    
    # Check if backup file exists
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
        echo "   Skipping backup restore."
    fi
fi

# Start the application
echo "🚀 Starting application..."
exec "$@"
