# Fix CORS Error

## Problem
Backend is allowing `http://localhost:5173` but frontend is `https://fer-henna-omega.vercel.app`

## Solution: Update Backend Environment Variable

### Step 1: Update .env file on server

SSH to your server and run:

```bash
cd /data/backend
nano .env
```

**Update the `FRONTEND_URL` line:**
```env
FRONTEND_URL=https://fer-henna-omega.vercel.app
```

**Save and exit:**
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter`

### Step 2: Restart Docker container

```bash
cd /data/backend
docker-compose restart
```

### Step 3: Verify it's working

```bash
# Check container logs
docker-compose logs backend | tail -20

# Test CORS (from server)
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.grahmind.com:8443/api/auth/signup -v
```

### Step 4: Test from frontend

1. Go to: https://fer-henna-omega.vercel.app/signup
2. Try signing up
3. Should work without CORS error!

## Alternative: Allow Multiple Origins

If you want to allow both localhost (for development) and Vercel (for production), update `server.js`:

```javascript
app.use(cors({
  origin: [
    'https://fer-henna-omega.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}))
```

But the simpler solution is to just update the `.env` file as shown above.

