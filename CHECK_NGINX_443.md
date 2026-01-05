# Check Nginx Port 443 Configuration

## Run These Commands on Your Server

### 1. Check if Nginx is listening on port 443

```bash
sudo netstat -tlnp | grep :443
# OR
sudo ss -tlnp | grep :443
```

**If nothing shows, Nginx is NOT listening on port 443.**

### 2. Check Nginx configuration for HTTPS

```bash
sudo cat /etc/nginx/sites-available/default
```

**Look for:**
- `listen 443 ssl;` or `listen 443 ssl http2;`
- SSL certificate paths
- Server name `api.grahmind.com`

### 3. Check all Nginx config files

```bash
sudo ls -la /etc/nginx/sites-enabled/
sudo cat /etc/nginx/sites-enabled/*
```

### 4. Check if certificate exists

```bash
sudo certbot certificates
sudo ls -la /etc/letsencrypt/live/api.grahmind.com/
```

### 5. Check firewall

```bash
sudo ufw status
```

If port 443 is not listed, add it:
```bash
sudo ufw allow 443/tcp
sudo ufw reload
```

## If Nginx is NOT listening on 443

This means the HTTPS server block is missing or not configured. You need to add it manually.

