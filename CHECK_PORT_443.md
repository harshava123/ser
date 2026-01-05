# Check if Nginx is Listening on Port 443

## Run These Commands

### 1. Check if Nginx is listening on port 443

```bash
# Use ss instead of netstat (more modern)
sudo ss -tlnp | grep :443

# OR check all listening ports
sudo ss -tlnp | grep nginx
```

**If nothing shows for port 443, Nginx is NOT listening on 443.**

### 2. Check Nginx error logs

```bash
sudo tail -20 /var/log/nginx/error.log
```

### 3. Check if there are other Nginx config files

```bash
sudo ls -la /etc/nginx/sites-enabled/
sudo cat /etc/nginx/sites-enabled/*
```

### 4. Try restarting Nginx (instead of reload)

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

### 5. Check if port 443 is actually open

```bash
# From the server itself, test localhost
curl -k https://localhost/api/health

# Check if port is listening locally
sudo ss -tlnp | grep :443
```

### 6. Verify the config file was saved correctly

```bash
sudo cat /etc/nginx/sites-available/default | grep -A 5 "443"
```

## Common Issues

### Issue: Config file not in sites-enabled
**Solution:**
```bash
# Check if default is symlinked
ls -la /etc/nginx/sites-enabled/

# If not, create symlink
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Issue: Another config file overriding
**Solution:**
```bash
# Check all enabled sites
sudo ls -la /etc/nginx/sites-enabled/

# Disable conflicting configs
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
```

