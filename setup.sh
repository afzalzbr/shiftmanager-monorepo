#!/bin/bash

# Shift Manager Monorepo Setup Script
echo "🚀 Setting up Shift Manager Monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (v16 or higher)"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version $NODE_VERSION is not supported. Please install Node.js v16 or higher"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_status "npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if .env file exists for API
if [ ! -f "packages/api/.env" ]; then
    print_warning ".env file not found in packages/api/"
    if [ -f "packages/api/.env.example" ]; then
        echo "📋 Copying .env.example to .env..."
        cp packages/api/.env.example packages/api/.env
        print_status ".env file created from .env.example"
        print_warning "Please update packages/api/.env with your configuration"
    else
        print_warning "No .env.example file found. You'll need to create packages/api/.env manually"
    fi
else
    print_status ".env file exists for API"
fi

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    print_status "MongoDB is installed locally"
else
    print_warning "MongoDB not found locally. Make sure to configure MONGO_URI in packages/api/.env"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update packages/api/.env with your configuration"
echo "2. Make sure MongoDB is running (local or Atlas)"
echo "3. Run 'npm run dev' to start both services"
echo ""
echo "Available commands:"
echo "  npm run dev      - Start both API and web in development"
echo "  npm run dev:api  - Start only the API server"
echo "  npm run dev:web  - Start only the React app"
echo "  npm run build    - Build both packages for production"
echo ""
print_status "Happy coding! 🚀"