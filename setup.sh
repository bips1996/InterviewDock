#!/bin/bash

echo "🚀 InterviewDock Setup Script"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend || exit

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file. Please update with your PostgreSQL credentials.${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install

echo ""
echo -e "${BLUE}Backend setup complete!${NC}"
echo ""

# Setup Frontend
cd ../frontend || exit

echo -e "${BLUE}Setting up frontend...${NC}"

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo "Installing frontend dependencies..."
npm install

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "========================"
echo "Next Steps:"
echo "========================"
echo ""
echo "1. Update backend/.env with your PostgreSQL credentials"
echo ""
echo "2. Create the database:"
echo "   psql -U postgres"
echo "   CREATE DATABASE interviewdock;"
echo "   \\q"
echo ""
echo "3. Start the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Seed the database (in another terminal):"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo "5. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "6. Visit http://localhost:3000"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
