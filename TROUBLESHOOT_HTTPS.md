# Troubleshoot HTTPS Connection Refused

## Problem
`curl: (7) Failed to connect to api.grahmind.com port 443 after 86 ms: Connection refused`

## Step-by-Step Troubleshooting

### Step 1: Check if Nginx is Running

```bash
sudo systemctl status nginx
```

**If not running, start it:**
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Check if Nginx is Listening on Port 443

```bash
sudo netstat -tlnp | grep :443
# OR
sudo ss -tlnp | grep :443
```

**If nothing shows, Nginx is not listening on port 443.**

### Step 3: Check Nginx Configuration

```bash
# Test configuration
sudo nginx -t

# View current configuration
sudo cat /etc/nginx/sites-available/default
```

**Look for:**
- `listen 443 ssl;` or `listen 443 ssl http2;`
- SSL certificate paths
- Server name matching `api.grahmind.com`

### Step 4: Check if Certificate Exists

```bash
# List certificates
sudo certbot certificates

# Check certificate files
sudo ls -la /etc/letsencrypt/live/api.grahmind.com/
```

### Step 5: Check Firewall

```bash
# Check firewall status
sudo ufw status

# If port 443 is not allowed, add it:
sudo ufw allow 443/tcp
sudo ufw reload
```

### Step 6: Check Nginx Logs

```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log
```

### Step 7: Manually Configure Nginx (If Needed)

If certbot didn't configure Nginx properly:

```bash
sudo nano /etc/nginx/sites-available/default
```

**Replace with this configuration:**

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name api.grahmind.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name api.grahmind.com;

    ssl_certificate /etc/letsencrypt/live/api.grahmind.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.grahmind.com/privkey.pem;
    
    # SSL configuration
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Proxy to backend
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
    }
}
```

**Then:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Check Router Port Forwarding

Make sure your router forwards:
- **External Port:** `443`
- **Internal IP:** `192.168.0.233`
- **Internal Port:** `443`

### Step 9: Test from Server

```bash
# Test HTTPS locally
curl -k https://localhost/api/health

# Test with domain
curl https://api.grahmind.com/api/health
```

## Quick Fix Commands

Run these in order:

```bash
# 1. Check Nginx status
sudo systemctl status nginx

# 2. Check if listening on 443
sudo netstat -tlnp | grep :443

# 3. Check firewall
sudo ufw status
sudo ufw allow 443/tcp

# 4. Test Nginx config
sudo nginx -t

# 5. Reload Nginx
sudo systemctl reload nginx

# 6. Test HTTPS
curl https://api.grahmind.com/api/health
```

## Common Issues

### Issue 1: Nginx not configured for HTTPS
**Solution:** Manually add HTTPS server block (see Step 7)

### Issue 2: Certificate path incorrect
**Solution:** Check certificate location:
```bash
sudo certbot certificates
sudo ls -la /etc/letsencrypt/live/
```

### Issue 3: Firewall blocking port 443
**Solution:** 
```bash
sudo ufw allow 443/tcp
sudo ufw reload
```

### Issue 4: Router not forwarding port 443
**Solution:** Add port forwarding rule in router settings

### Issue 5: Nginx not running
**Solution:**
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

