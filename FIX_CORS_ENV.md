# Fix CORS - Check Environment Variable

## The Issue
Code is correct, but CORS is still returning wrong origin. This might be because:
1. Container needs restart to pick up new code
2. FRONTEND_URL environment variable is set incorrectly

## Check .env file

```bash
cd /data/backend
cat .env | grep FRONTEND_URL
```

**If it shows:** `FRONTEND_URL=http://localhost:5173`
**Then:** This is overriding the default. Either:
- Remove it (let it use default)
- Or set it to: `FRONTEND_URL=https://fer-henna-omega.vercel.app`

## Restart container to pick up changes

```bash
docker-compose restart
```

## Or rebuild completely

```bash
docker-compose down
docker-compose up -d --build
```

## Test again

```bash
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.grahmind.com:8443/api/auth/signup -v | grep "Access-Control-Allow-Origin"
```

Should show: `Access-Control-Allow-Origin: https://fer-henna-omega.vercel.app`

