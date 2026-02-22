#!/bin/sh

# Docker startup script for InterviewDock backend
# This script seeds the database and then starts the server

set -e

echo "🚀 Starting InterviewDock Backend..."

# Wait a bit for postgres to be fully ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run seed script (it will handle checking if data exists)
echo "🌱 Running seed script..."
npm run seed:docker || echo "⚠️  Seed failed, but continuing with server startup..."

# Start the server
echo "🚀 Starting server..."
exec node dist/index.js
