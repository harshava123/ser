# Manual Deployment to Server

## Current Situation
Server doesn't have git repository, so CI/CD might be deploying differently or code was uploaded manually.

## Check Current Deployment

### 1. Check if server.js has CORS fix

```bash
cd /data/backend
grep -A 15 "allowedOrigins" server.js
```

**If it shows the new CORS code:** ✅ Code is updated
**If it shows old code:** ❌ Need to update

### 2. Check Docker container

```bash
cd /data/backend
docker-compose ps
docker-compose logs backend | tail -20
```

### 3. Check .env file

```bash
cat .env | grep FRONTEND_URL
```

## Update Server Manually

### Option 1: If CI/CD is working, wait for it

The GitHub Actions workflow should SSH to server and update. Check if it's running.

### Option 2: Manual update via SCP

From your laptop, upload the updated files:

```bash
# From your laptop (Windows)
cd D:\ser\backend
scp server.js root@97.77.20.150:/data/backend/
```

Then on server:
```bash
cd /data/backend
docker-compose restart
```

### Option 3: Initialize git and pull

```bash
cd /data/backend
git init
git remote add origin https://github.com/harshava123/ser.git
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Quick Fix: Just Update CORS

If you just want to fix CORS quickly, edit server.js on server:

```bash
cd /data/backend
nano server.js
```

Find the CORS section (around line 11-15) and replace with:

```javascript
// Middleware - CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['https://fer-henna-omega.vercel.app', 'http://localhost:5173', 'http://localhost:3000']

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

Then restart:
```bash
docker-compose restart
```

