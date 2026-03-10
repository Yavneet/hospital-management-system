#!/bin/bash

# Hospital Management System Deployment Script

set -e

echo "🚀 Starting deployment of Hospital Management System..."

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | xargs)
else
    echo "❌ .env file not found. Please create one based on .env.example"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start containers
echo "▶️  Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check container status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

# Run health checks
echo "🏥 Running health checks..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health || echo "000")
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health || echo "000")

if [ "$BACKEND_HEALTH" = "200" ] && [ "$FRONTEND_HEALTH" = "200" ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Frontend: http://localhost"
    echo "🔗 Backend API: http://localhost:5000"
else
    echo "❌ Health checks failed!"
    echo "Backend health: $BACKEND_HEALTH"
    echo "Frontend health: $FRONTEND_HEALTH"
    exit 1
fi

echo "🎉 Deployment completed successfully!"