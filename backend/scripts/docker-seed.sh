#!/bin/bash

# Docker Seed Helper Script
# Makes it easy to seed the database in Docker

set -e

echo "🌱 Docker Database Seeding Script"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check which compose file to use
COMPOSE_FILE="docker-compose.yml"
if [ "$1" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "📦 Using production configuration"
else
    echo "📦 Using development configuration"
fi

# Check if containers are running
if ! docker-compose -f $COMPOSE_FILE ps | grep -q "backend"; then
    echo "⚠️  Backend container is not running."
    echo "   Start it with: docker-compose -f $COMPOSE_FILE up -d"
    exit 1
fi

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Run seed command
echo "🌱 Running seed script..."
docker-compose -f $COMPOSE_FILE exec backend npm run seed

# Verify seeding
echo ""
echo "🔍 Verifying data..."
QUESTION_COUNT=$(docker-compose -f $COMPOSE_FILE exec -T postgres psql -U postgres -d interviewdock -tAc "SELECT COUNT(*) FROM questions" 2>/dev/null || echo "0")

if [ "$QUESTION_COUNT" -gt 0 ]; then
    echo "✅ Seed successful! Database has $QUESTION_COUNT questions."
else
    echo "⚠️  Seed may have failed. No questions found in database."
    echo "   Check logs with: docker-compose -f $COMPOSE_FILE logs backend"
fi

echo ""
echo "🎉 Done!"
