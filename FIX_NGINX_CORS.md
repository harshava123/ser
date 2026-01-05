# Fix Nginx CORS Headers

## Problem
Backend returns correct CORS (`https://fer-henna-omega.vercel.app`) when accessed directly, but Nginx is modifying it.

## Solution: Check Nginx Config

```bash
cat /etc/nginx/sites-available/default | grep -A 15 "location /api"
```

Nginx might be:
1. Adding its own CORS headers
2. Caching old headers
3. Not passing through the origin header correctly

## Fix: Update Nginx Config

Make sure Nginx doesn't add CORS headers and passes them through:

```nginx
location /api {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Don't add CORS headers - let backend handle it
    # Remove any add_header directives for CORS
}
```

## Check for CORS headers in Nginx

```bash
grep -i "add_header.*origin" /etc/nginx/sites-available/default
grep -i "add_header.*cors" /etc/nginx/sites-available/default
```

If you find any, remove them or comment them out.

