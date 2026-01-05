# Fix Git Pull Conflict and Update Code

## Problem
Git pull failed because files already exist, but Docker was built anyway (with old code).

## Solution: Force Pull Latest Code

### Step 1: Force pull from GitHub

```bash
cd /data/backend
git reset --hard origin/main
```

This will overwrite local files with the latest from GitHub.

### Step 2: Rebuild Docker container

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Step 3: Verify CORS code is updated

```bash
grep -A 15 "allowedOrigins" server.js
```

Should show the new CORS configuration.

### Step 4: Check container logs

```bash
docker-compose logs backend | tail -20
```

### Step 5: Test CORS

```bash
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.grahmind.com:8443/api/auth/signup -v
```

Look for: `Access-Control-Allow-Origin: https://fer-henna-omega.vercel.app`

## Alternative: Just Update server.js Manually

If you want to fix it quickly without git:

```bash
cd /data/backend
nano server.js
```

Update CORS section (lines 995-999) and restart:
```bash
docker-compose restart
```

