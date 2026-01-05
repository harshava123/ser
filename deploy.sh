#!/bin/bash
# Deployment script for backend server
# Run this script on your server

set -e

echo "🚀 Starting backend deployment..."

# Navigate to backend directory
cd /data/backend || exit 1

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main || echo "⚠️  Git pull failed, continuing..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Build new images
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Start containers
echo "▶️  Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=50

# Health check
echo "🏥 Checking health..."
sleep 5
if curl -f http://localhost:5000/api/health; then
  echo "✅ Deployment successful! Backend is running."
else
  echo "❌ Health check failed!"
  docker-compose logs
  exit 1
fi

echo "✨ Deployment complete!"

