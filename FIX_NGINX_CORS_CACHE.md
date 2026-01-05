# Fix Nginx CORS Issue

## Problem
- Backend on port 5000: ✅ Works correctly
- Through Nginx on port 8443: ❌ Returns wrong CORS header

## Solution: Check Nginx Configuration

### 1. Check if Nginx is caching responses

```bash
grep -i "proxy_cache" /etc/nginx/sites-available/default
grep -i "add_header" /etc/nginx/sites-available/default
```

### 2. Check if there are multiple server blocks

```bash
cat /etc/nginx/sites-available/default | grep -B 5 -A 20 "server {"
```

### 3. Check if Nginx is adding CORS headers

```bash
grep -i "access-control" /etc/nginx/sites-available/default
```

### 4. Clear Nginx cache and restart

```bash
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx
```

### 5. Check Nginx error logs

```bash
sudo tail -20 /var/log/nginx/error.log
```

## Most Likely Issue

Nginx might be:
1. Caching the old response
2. Adding its own CORS headers
3. Proxying to a different backend instance

