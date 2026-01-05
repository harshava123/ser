# Setup HTTPS for Backend

## Problem
Your frontend on Vercel (HTTPS) cannot access your backend (HTTP) due to Mixed Content security policy.

## Solution
Set up SSL/TLS certificate using Let's Encrypt (free) and configure Nginx to serve HTTPS.

## Step-by-Step Guide

### 1. Install Certbot

```bash
# On your server
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Get SSL Certificate

**Option A: If you have a domain name pointing to your server**

```bash
# Replace 'yourdomain.com' with your actual domain
sudo certbot --nginx -d yourdomain.com
```

**Option B: If you only have IP address (97.77.20.150)**

You need a domain name for Let's Encrypt. You can:
- Get a free domain from Freenom, No-IP, or DuckDNS
- Point it to your IP: `97.77.20.150`
- Then run certbot with that domain

### 3. Configure Nginx for HTTPS

After certbot runs, it will automatically configure Nginx. But you may need to manually update it:

```bash
sudo nano /etc/nginx/sites-available/default
```

Make sure it looks like this:

```nginx
server {
    listen 80;
    server_name 97.77.20.150 yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 97.77.20.150 yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

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

### 4. Test Nginx Configuration

```bash
sudo nginx -t
```

### 5. Reload Nginx

```bash
sudo systemctl reload nginx
```

### 6. Update Frontend Environment Variable

In Vercel, go to your project settings → Environment Variables:

**Add/Update:**
- `VITE_API_URL=https://yourdomain.com` (or `https://97.77.20.150` if using IP)

**Important:** After updating, redeploy your frontend on Vercel.

### 7. Update Backend CORS

Update your backend `.env` file on the server:

```bash
cd /data/backend
nano .env
```

Update `FRONTEND_URL`:
```env
FRONTEND_URL=https://fer-henna-omega.vercel.app
```

Then restart backend:
```bash
docker-compose restart
```

### 8. Open Firewall Port 443

```bash
sudo ufw allow 443/tcp
sudo ufw reload
```

### 9. Test HTTPS

```bash
curl https://yourdomain.com/api/health
```

## Quick Alternative: Self-Signed Certificate (For Testing Only)

If you can't get a domain name right now, you can use a self-signed certificate (browsers will show a warning):

```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt

# Update Nginx config to use self-signed cert
sudo nano /etc/nginx/sites-available/default
```

Add SSL configuration:
```nginx
server {
    listen 443 ssl;
    server_name 97.77.20.150;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Note:** Self-signed certificates will show a security warning in browsers. Only use for testing.

## Auto-Renewal (Let's Encrypt)

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Certificate not working?
- Check domain DNS points to your IP
- Check firewall allows port 443
- Check Nginx config: `sudo nginx -t`
- Check logs: `sudo tail -f /var/log/nginx/error.log`

### Still getting Mixed Content?
- Make sure frontend uses `https://` not `http://`
- Clear browser cache
- Check browser console for specific errors

