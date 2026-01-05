# Check Full Nginx Configuration

## Check all server blocks

```bash
cat /etc/nginx/sites-available/default | grep -B 5 -A 20 "server {"
```

There might be multiple server blocks, and one might be handling the request.

## Check for proxy cache

```bash
grep -i "proxy_cache" /etc/nginx/sites-available/default
grep -i "cache" /etc/nginx/nginx.conf
```

If proxy cache is enabled, it might be serving old responses.

## Check which server block is handling the request

```bash
cat /etc/nginx/sites-available/default
```

Look for:
- Multiple `server` blocks
- Different `server_name` values
- Any `default_server` directives

## Clear Nginx cache (if exists)

```bash
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

## Test with full verbose output

```bash
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.grahmind.com:8443/api/auth/signup -v 2>&1 | head -50
```

This will show all headers to see what's happening.

