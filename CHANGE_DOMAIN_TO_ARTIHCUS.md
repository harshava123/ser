# Change Domain from api.grahmind.com to api.artihcus.com

## Overview

When you're ready to change the domain, you'll need to update:
1. DNS records
2. SSL certificate (Let's Encrypt)
3. Nginx configuration
4. Frontend environment variable (Vercel)
5. Backend CORS configuration (if needed)

## Step-by-Step Guide

### Step 1: Update DNS Record

In your DNS provider (where `artihcus.com` is managed):

1. **Add A record**:
   - **Type**: A
   - **Name**: `api` (or `api.artihcus.com`)
   - **Value**: `97.77.20.150`
   - **TTL**: 300 (or default)

2. **Wait for DNS propagation** (can take a few minutes to 48 hours)
   - Check: `ping api.artihcus.com` - should resolve to `97.77.20.150`

### Step 2: Update SSL Certificate on Server

SSH to your server and run:

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get new SSL certificate for api.artihcus.com
sudo certbot certonly --standalone -d api.artihcus.com

# Start Nginx
sudo systemctl start nginx
```

### Step 3: Update Nginx Configuration

```bash
# Backup current config
sudo cp /etc/nginx/sites-available/api.grahmind.com /etc/nginx/sites-available/api.grahmind.com.backup

# Edit the config
sudo nano /etc/nginx/sites-available/api.grahmind.com
```

**Replace the entire file with**:

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.artihcus.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.artihcus.com;

    ssl_certificate /etc/letsencrypt/live/api.artihcus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.artihcus.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Proxy to backend on port 5000
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

**Changes made**:
- `server_name api.grahmind.com` → `server_name api.artihcus.com`
- SSL certificate paths updated to `api.artihcus.com`

**Test and reload**:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Update Frontend (Vercel)

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Select your project**: `fer-henna-omega` (or your project name)
3. **Go to Settings → Environment Variables**
4. **Update `VITE_API_URL`**:
   - **Old**: `https://api.grahmind.com:8443`
   - **New**: `https://api.artihcus.com:8443`
5. **Redeploy** your frontend (or push a new commit)

### Step 5: Update Backend CORS (if needed)

If your frontend URL changes, update the backend `.env`:

```bash
cd /data/backend
nano .env
```

Update `FRONTEND_URL` if your frontend domain changes:
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Then restart the backend:
```bash
docker-compose restart backend
```

### Step 6: Update Router Port Forwarding (if needed)

If you're using a different port or need to update port forwarding:

1. **Access your router admin panel**
2. **Update port forwarding rule**:
   - External port: `8443` (or `443`)
   - Internal IP: `192.168.0.233`
   - Internal port: `443`
   - Protocol: TCP

### Step 7: Test the New Domain

```bash
# Test from server
curl https://api.artihcus.com:8443/api/health

# Test CORS
curl -H "Origin: https://fer-henna-omega.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.artihcus.com:8443/api/auth/signup -v
```

## Quick Script to Do Everything

Save this as `change-domain.sh` on your server:

```bash
#!/bin/bash

NEW_DOMAIN="api.artihcus.com"
OLD_DOMAIN="api.grahmind.com"

echo "🔄 Changing domain from $OLD_DOMAIN to $NEW_DOMAIN..."

# Step 1: Stop Nginx
echo "⏸️  Stopping Nginx..."
sudo systemctl stop nginx

# Step 2: Get new SSL certificate
echo "🔐 Getting SSL certificate for $NEW_DOMAIN..."
sudo certbot certonly --standalone -d $NEW_DOMAIN

# Step 3: Update Nginx config
echo "📝 Updating Nginx configuration..."
sudo tee /etc/nginx/sites-available/api.grahmind.com > /dev/null << EOF
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $NEW_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $NEW_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$NEW_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$NEW_DOMAIN/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Proxy to backend on port 5000
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Step 4: Test and reload Nginx
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    echo "🔄 Reloading Nginx..."
    sudo systemctl start nginx
    sudo systemctl reload nginx
    echo "✅ Domain change complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update DNS A record for $NEW_DOMAIN to point to 97.77.20.150"
    echo "2. Update Vercel environment variable VITE_API_URL to https://$NEW_DOMAIN:8443"
    echo "3. Test: curl https://$NEW_DOMAIN:8443/api/health"
else
    echo "❌ Nginx config test failed!"
    exit 1
fi
```

**Run it**:
```bash
chmod +x change-domain.sh
./change-domain.sh
```

## Important Notes

1. **DNS Propagation**: Can take 5 minutes to 48 hours
2. **SSL Certificate**: Let's Encrypt will issue a new certificate for the new domain
3. **Port Forwarding**: Make sure router port forwarding still works (should be the same)
4. **Frontend Update**: Don't forget to update Vercel environment variables!
5. **Old Domain**: You can keep the old domain working too by adding both `server_name` entries

## Keep Both Domains Working (Optional)

If you want both domains to work temporarily:

```nginx
server_name api.grahmind.com api.artihcus.com;
```

And get certificates for both:
```bash
sudo certbot certonly --standalone -d api.grahmind.com -d api.artihcus.com
```

## Checklist

- [ ] DNS A record added for `api.artihcus.com` → `97.77.20.150`
- [ ] DNS propagated (check with `ping api.artihcus.com`)
- [ ] SSL certificate obtained for `api.artihcus.com`
- [ ] Nginx configuration updated
- [ ] Nginx tested and reloaded
- [ ] Vercel `VITE_API_URL` updated
- [ ] Frontend redeployed
- [ ] Tested: `curl https://api.artihcus.com:8443/api/health`
- [ ] Tested CORS from frontend

