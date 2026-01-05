# Backend Server

Node.js backend with Express, MongoDB, and JWT authentication.

## Server Information
- **IP**: 97.77.20.150
- **Port**: 5000
- **Deployment Path**: `/data/backend`

## Quick Start

### Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Production Deployment

```bash
# On server
cd /data/backend
docker-compose up -d
```

## Environment Variables

Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/myapp
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.vercel.app
```

## API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check

## Docker Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build
```

## Deployment

See `../DEPLOYMENT_COMPLETE_GUIDE.md` for full deployment instructions.

