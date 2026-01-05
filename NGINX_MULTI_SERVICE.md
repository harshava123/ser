# Nginx Configuration for Multiple Services

## Setup: Port 443 → Backend Server (192.168.0.233)

Since you need port 443 for both services, we'll:
1. Forward port 443 to `192.168.0.233` (your backend server)
2. Configure Nginx on `192.168.0.233` to route traffic based on domain/subdomain
3. Nginx will proxy to the other service (192.168.0.74) when needed

## Step 1: Update Router Port Forwarding

**Change the existing port 443 rule:**
- Device IP Address: `192.168.0.74` → `192.168.0.233`
- Service Name: Change to "Backend HTTPS" or "API HTTPS"
- Keep everything else the same

## Step 2: Configure Nginx for Multiple Services

On your server (192.168.0.233), update Nginx config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace with this configuration:

```nginx
# HTTP - Redirect to HTTPS for API
server {
    listen 80;
    listen [::]:80;
    server_name api.grahmind.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS - API Backend (your Node.js app)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.grahmind.com;

    ssl_certificate /etc/letsencrypt/live/api.grahmind.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.grahmind.com/privkey.pem;
    
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Proxy to your Node.js backend
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

# HTTPS - Proxy to other service (192.168.0.74)
# Add this if you need to access the other service via a different domain
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hana.grahmind.com;  # Change to your domain for the other service

    ssl_certificate /etc/letsencrypt/live/api.grahmind.com/fullchain.pem;  # Use same cert or get separate one
    ssl_certificate_key /etc/letsencrypt/live/api.grahmind.com/privkey.pem;
    
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Proxy to the other service
    location / {
        proxy_pass https://192.168.0.74:443;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_verify off;  # If the other service uses self-signed cert
    }
}
```

**Or, if you don't need domain-based routing, use a different external port:**

## Alternative: Use Different External Ports

### Option A: Keep Current Setup + Add New Rule

1. **Keep existing port 443 rule** pointing to `192.168.0.74`
2. **Add new port forwarding rule:**
   - Service Name: "Backend HTTPS" or "API HTTPS"
   - Device IP Address: `192.168.0.233`
   - External Port: `8443` (or any available port)
   - Internal Port: `443`
   - Protocol: `TCP`
   - Status: Enabled

3. **Update Vercel environment variable:**
   - `VITE_API_URL=https://api.grahmind.com:8443`

**Note:** This requires accessing your API via `https://api.grahmind.com:8443` instead of just `https://api.grahmind.com`

### Option B: Use IP-Based Access for One Service

If the other service (192.168.0.74) can be accessed via IP directly:
- Keep port 443 for `api.grahmind.com` (192.168.0.233)
- Access the other service via its public IP on a different port

## Recommended Solution

**I recommend Option A** (different external ports) because:
- ✅ Simpler configuration
- ✅ No need to modify Nginx routing
- ✅ Both services work independently
- ✅ Just need to specify port in frontend URL

## After Setup

1. Test your backend:
   ```bash
   curl https://api.grahmind.com:8443/api/health
   ```

2. Update Vercel:
   - `VITE_API_URL=https://api.grahmind.com:8443`

3. Update frontend code if needed to use the port in API calls.

