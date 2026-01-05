# Setup HTTPS for api.grahmind.com

## Your Setup
- **Subdomain:** `api.grahmind.com` ✅ (Already configured in DNS)
- **Server IP:** `97.77.20.150`
- **Backend Port:** `5000` (internal)

## Step-by-Step Guide

### Step 1: Verify DNS is Configured ✅

**Your DNS is already set up!**

You have:
- **Type:** A
- **Name:** `api`
- **Value:** `97.77.20.150` ✅
- **TTL:** 3600

**Verify it's working:**

```bash
# From your laptop
ping api.grahmind.com
# Should show: 97.77.20.150

# Or check with nslookup
nslookup api.grahmind.com
```

### Step 2: Install Certbot on Server

```bash
# SSH to your server
ssh root@97.77.20.150

# Update packages
sudo apt update

# Install certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

### Step 3: Get SSL Certificate

```bash
# Get certificate for your subdomain
sudo certbot --nginx -d api.grahmind.com

# Follow the prompts:
# 1. Enter your email address (for renewal notices)
# 2. Agree to terms of service (A)
# 3. Choose whether to share email (your choice)
# 4. Redirect HTTP to HTTPS? (2 - Yes, recommended)
```

Certbot will:
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Configure Nginx automatically
- ✅ Set up auto-renewal

### Step 4: Verify Nginx Configuration

```bash
# Test Nginx config
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
```

### Step 5: Check Nginx Configuration

```bash
# View the auto-generated config
sudo nano /etc/nginx/sites-available/default
```

It should look something like this:

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
    
    # SSL configuration (added by certbot)
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

**If the `/api` location block is missing, add it manually:**

```bash
sudo nano /etc/nginx/sites-available/default
```

Add this inside the HTTPS server block (after the SSL lines):

```nginx
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
```

Then test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Open Firewall Port 443

```bash
# Allow HTTPS traffic
sudo ufw allow 443/tcp

# Verify
sudo ufw status
```

### Step 7: Test HTTPS Backend

```bash
# Test from server
curl https://api.grahmind.com/api/health

# Should return:
# {"status":"OK","message":"Server is running","timestamp":"..."}
```

### Step 8: Update Router Port Forwarding

**In your router settings, add:**
- **External Port:** `443`
- **Internal IP:** `192.168.0.233`
- **Internal Port:** `443`
- **Protocol:** TCP

### Step 9: Update Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Select your project: `fer-henna-omega`
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` and update it:
   - **Value:** `https://api.grahmind.com`
5. **Save**
6. **Redeploy** your frontend:
   - Go to **Deployments** tab
   - Click the "..." menu on latest deployment
   - Click **Redeploy**

### Step 10: Update Backend CORS

```bash
# On server
cd /data/backend
nano .env
```

Update `FRONTEND_URL`:
```env
FRONTEND_URL=https://fer-henna-omega.vercel.app
```

Restart backend:
```bash
docker-compose restart
```

### Step 11: Test Everything

1. **Test backend directly:**
   ```bash
   curl https://api.grahmind.com/api/health
   ```

2. **Test from browser:**
   - Go to: https://fer-henna-omega.vercel.app/signup
   - Try to sign up
   - Check browser console (F12) - should NOT see Mixed Content error

3. **Test signup/login:**
   - Sign up a new user
   - Check MongoDB to verify user was saved
   - Login with credentials
   - Should redirect to dashboard

## Troubleshooting

### Certificate not working?

```bash
# Check certificate status
sudo certbot certificates

# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### DNS not resolving?

```bash
# Check DNS propagation
nslookup api.grahmind.com

# Or
dig api.grahmind.com

# Should show: 97.77.20.150
```

### Can't access HTTPS?

1. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 443/tcp
   ```

2. **Check router port forwarding:**
   - Port 443 → 192.168.0.233:443

3. **Test from server:**
   ```bash
   curl https://localhost/api/health
   ```

### Still getting Mixed Content?

1. Make sure Vercel environment variable is `https://app.grahmind.com`
2. Clear browser cache
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Check browser console for specific errors

## Auto-Renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

Certificates renew automatically every 90 days.

## Summary

After setup:
- ✅ Backend: `https://api.grahmind.com/api/*`
- ✅ Frontend: `https://fer-henna-omega.vercel.app`
- ✅ No Mixed Content errors
- ✅ SSL certificate auto-renews

