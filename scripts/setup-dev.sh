#!/bin/bash

# WaterTime Development Environment Setup Script
# This script sets up the development environment for the WaterTime project

set -e

echo "🚀 Setting up WaterTime Development Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists, if not copy from example
if [ ! -f .env.local ]; then
    echo -e "${BLUE}📝 Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env.local with your actual configuration${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

# Start Docker services
echo ""
echo -e "${BLUE}🐳 Starting Docker services (PostgreSQL, Redis)...${NC}"
docker-compose up -d postgres redis

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 5

# Check service health
echo ""
echo -e "${BLUE}🔍 Checking service health...${NC}"
if docker-compose ps | grep -q "watertime-postgres.*Up"; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL may not be ready yet${NC}"
fi

if docker-compose ps | grep -q "watertime-redis.*Up"; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${YELLOW}⚠️  Redis may not be ready yet${NC}"
fi

# Install app dependencies
echo ""
echo -e "${BLUE}📦 Installing app dependencies...${NC}"
cd app
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ App dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  No package.json found in app directory${NC}"
fi
cd ..

# Install server dependencies
echo ""
echo -e "${BLUE}📦 Installing server dependencies...${NC}"
cd server
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Server dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  No package.json found in server directory${NC}"
fi
cd ..

echo ""
echo -e "${GREEN}✨ Development environment setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env.local with your configuration"
echo "2. Run 'npm run dev:app' to start the React Native app"
echo "3. Run 'npm run dev:server' to start the backend server"
echo ""
echo -e "${BLUE}Available commands:${NC}"
echo "  npm run dev:all     - Start both app and server"
echo "  npm run dev:app     - Start React Native app"
echo "  npm run dev:server  - Start backend server"
echo "  npm run db:setup    - Setup database with Prisma"
echo "  npm run db:migrate  - Run database migrations"
echo "  npm run db:seed     - Seed database with sample data"
echo "  npm run test        - Run all tests"
echo "  npm run lint        - Run linting"
echo "  npm run format      - Format code"
echo ""
