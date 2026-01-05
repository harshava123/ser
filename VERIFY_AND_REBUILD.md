# Verify Code and Rebuild Container

## Check if container has debug code

```bash
docker exec backend cat /app/server.js | grep -A 5 "🔍 CORS check"
```

**If it shows the debug logs:** Code is there, but maybe not being called
**If it doesn't show:** Container has old code, needs rebuild

## Force rebuild

```bash
cd /data/backend
docker-compose down
docker rmi backend_backend  # Remove the image
docker-compose build --no-cache
docker-compose up -d
```

## Verify code after rebuild

```bash
docker exec backend cat /app/server.js | grep "🔍 CORS check"
```

Should show the debug logging code.

## Test with direct backend access

```bash
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:5000/api/auth/signup -v
```

This bypasses Nginx and tests backend directly. Check logs for debug output.

