# Check Environment Variable in Container

## The Issue
Code is correct, but CORS still returns wrong origin. Check if environment variable is set correctly in container.

## Check environment variable in container

```bash
docker exec backend env | grep FRONTEND_URL
```

**Should show:** `FRONTEND_URL=https://fer-henna-omega.vercel.app`

## Check what allowedOrigins is actually set to

Add temporary logging to see what's happening:

```bash
docker exec backend node -e "
const dotenv = require('dotenv');
dotenv.config();
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['https://fer-henna-omega.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];
console.log('allowedOrigins:', allowedOrigins);
"
```

## If FRONTEND_URL is not set in container

The docker-compose.yml might not be loading the .env file correctly. Check docker-compose.yml to see how environment variables are passed.

