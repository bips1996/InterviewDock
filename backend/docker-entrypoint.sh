#!/bin/sh

# Docker entrypoint script for backend container
# Handles database initialization and seeding

set -e

echo "🚀 Starting backend initialization..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Check if we should seed the database
if [ "${SEED_DATABASE}" = "true" ]; then
    echo "🌱 Seeding database..."
    
    # Try to run the appropriate seed command
    if [ -f "src/database/seed.ts" ] && command -v ts-node > /dev/null; then
        echo "📝 Using ts-node to run seed script..."
        npm run seed
    elif [ -f "dist/database/seed.js" ]; then
        echo "📝 Using compiled seed script..."
        npm run seed:prod
    else
        echo "⚠️  Seed script not found. Skipping seeding."
        echo "   Run seeding manually with: docker-compose exec backend npm run seed"
    fi
    
    echo "✅ Seeding complete"
fi

# Start the application
echo "🚀 Starting application..."
exec "$@"
