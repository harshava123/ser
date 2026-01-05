#!/bin/bash
set -e

echo "=========================================="
echo "🚀 UPDATING SERVER"
echo "=========================================="

cd /data/backend

echo "📥 Fetching latest code..."
git fetch origin --force

echo "🔄 Resetting to origin/main..."
git reset --hard origin/main

echo "📋 Current commit:"
git log -1 --oneline

echo ""
echo "📝 Creating .env file..."
cat > .env << 'EOF'
# Docker image
DOCKER_IMAGE=harshava123/ser-backend:latest

# MongoDB
MONGODB_URI=mongodb://admin:Artihcus%40123@localhost:27017/myapp?authSource=admin

# Server
PORT=5000
NODE_ENV=production

# JWT Secret
JWT_SECRET=my-super-secret-key-12345-change-this

# Frontend URL
FRONTEND_URL=https://fer-henna-omega.vercel.app
EOF

echo "✅ .env file created"

echo ""
echo "🐳 Pulling latest Docker image..."
docker pull harshava123/ser-backend:latest

echo ""
echo "🛑 Stopping old container..."
docker-compose down

echo ""
echo "🚀 Starting new container..."
docker-compose up -d

sleep 5

echo ""
echo "📊 Container status:"
docker-compose ps

echo ""
echo "📋 Recent logs:"
docker-compose logs --tail=30 backend

echo ""
echo "✅ UPDATE COMPLETE!"
echo ""
echo "Test the API:"
echo "curl http://localhost:5000/api/health"

