# Quick Reference - Server Deployment

## Server Information
- **IP**: 97.77.20.150
- **Backend Port**: 5000
- **MongoDB Port**: 27017
- **Deployment Path**: `/data/backend`

## MongoDB Credentials
- **Username**: `admin`
- **Password**: `Admin@123`
- **Connection String**: `mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin`

## Quick Commands

### On Server

```bash
# Navigate to backend
cd /data/backend

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin
PORT=5000
JWT_SECRET=$(openssl rand -base64 32)
FRONTEND_URL=https://your-app.vercel.app
EOF

# Deploy
chmod +x deploy.sh
./deploy.sh

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Start
docker-compose up -d
```

### Test MongoDB

```bash
# Connect to MongoDB
mongosh -u admin -p Admin@123 --authenticationDatabase admin

# Test connection string
mongosh "mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin"
```

### Test Backend

```bash
# Health check
curl http://localhost:5000/api/health
curl http://97.77.20.150:5000/api/health

# Test signup
curl -X POST http://97.77.20.150:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=http://97.77.20.150:5000
```

## Important Notes

1. **Password Encoding**: `@` in password must be `%40` in connection string
2. **Network Mode**: Docker uses `host` network to access MongoDB on localhost
3. **CORS**: Update `FRONTEND_URL` after Vercel deployment
4. **Security**: Consider creating app user instead of using admin (see MONGODB_SETUP.md)

## Troubleshooting

```bash
# Check MongoDB
sudo systemctl status mongod
mongosh -u admin -p Admin@123 --authenticationDatabase admin

# Check Docker
docker ps
docker-compose logs backend

# Check firewall
sudo ufw status
sudo ufw allow 5000/tcp
```

