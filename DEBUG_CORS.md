# Debug CORS Issue

## Check code in container

```bash
docker exec backend cat /app/server.js | grep -A 15 "origin: function"
```

Should show:
```javascript
callback(null, origin)  // ✅ Should return origin explicitly
```

NOT:
```javascript
callback(null, true)  // ❌ Old code
```

## Check if there are multiple CORS middleware

```bash
docker exec backend cat /app/server.js | grep -i cors
```

Should only show ONE `app.use(cors(...))` call.

## Test directly on backend (bypass Nginx)

```bash
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:5000/api/auth/signup -v 2>&1 | grep "Access-Control-Allow-Origin"
```

This bypasses Nginx and tests the backend directly.

## Check Nginx isn't modifying headers

Nginx might be caching or modifying CORS headers. Check Nginx config:

```bash
cat /etc/nginx/sites-available/default | grep -i cors
```

## Restart everything

```bash
docker-compose restart
sudo systemctl reload nginx
```

