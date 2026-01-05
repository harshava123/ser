# Verify Code is Updated on Server

## Check if server.js has the new CORS code

Run on server:

```bash
cd /data/backend
cat server.js | grep -A 5 "allowedOrigins"
```

**Should show:**
```javascript
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['https://fer-henna-omega.vercel.app', 'http://localhost:5173', 'http://localhost:3000']
```

**If it shows old code:**
```javascript
origin: process.env.FRONTEND_URL || '*',
```

Then the code wasn't updated. Run:
```bash
git pull origin main
```

## Check what commit is on server

```bash
cd /data/backend
git log --oneline -3
```

**Should show:** "Fix syntax error - remove corrupted lines and fix CORS" (commit 29fcc15)

## If code is updated but container still has old code

The Docker build might be using cached files. Force rebuild:

```bash
cd /data/backend
docker-compose down
docker system prune -f
docker-compose build --no-cache --pull
docker-compose up -d
```

## Check container has new code

```bash
docker exec backend cat /app/server.js | grep -A 5 "allowedOrigins"
```

This checks the code INSIDE the container.

