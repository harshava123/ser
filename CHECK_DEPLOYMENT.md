# Check Server Deployment Status

## Commands to Run on Server

### 1. Check if latest code is pulled

```bash
cd /data/backend
git log --oneline -5
```

**Look for:** "Update CORS to support multiple origins" commit (d662379)

### 2. Check Docker container status

```bash
cd /data/backend
docker-compose ps
docker-compose logs backend | tail -30
```

**Look for:**
- Container is running
- No errors in logs
- Server started successfully

### 3. Check if CORS code is updated

```bash
cd /data/backend
grep -A 10 "allowedOrigins" server.js
```

**Should show:** The new CORS configuration with multiple origins

### 4. Check .env file

```bash
cd /data/backend
cat .env | grep FRONTEND_URL
```

**Should show:** `FRONTEND_URL=https://fer-henna-omega.vercel.app` (or empty, which is fine)

### 5. Test CORS from server

```bash
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.grahmind.com:8443/api/auth/signup -v
```

**Look for:** `Access-Control-Allow-Origin: https://fer-henna-omega.vercel.app`

### 6. If code is not updated, manually pull and restart

```bash
cd /data/backend
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose logs backend | tail -20
```

