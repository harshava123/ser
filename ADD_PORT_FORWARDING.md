# Add Port Forwarding for Backend (Without Disturbing Existing)

## Goal
Add a new port forwarding rule for your backend API without changing the existing port 443 rule.

## Step-by-Step Instructions

### Step 1: Add New Port Forwarding Rule in Router

1. **Click the "Add" button** (top right of the port forwarding table)

2. **Fill in the new rule:**
   - **Service Name:** `Backend API` or `API HTTPS`
   - **Device IP Address:** `192.168.0.233`
   - **External Port:** `8443` (or choose any available port like 9443, 8444)
   - **Internal Port:** `443`
   - **Protocol:** `TCP`
   - **Status:** Enable it (toggle ON)

3. **Click Save/Apply**

**Important:** 
- ✅ Keep existing port 443 rule unchanged (pointing to 192.168.0.74)
- ✅ This adds a NEW rule, doesn't modify existing ones

### Step 2: Wait for Router to Apply Changes

Wait 1-2 minutes for the router to apply the new rule.

### Step 3: Test from Your Laptop

```bash
# Test the backend on the new port
curl https://api.grahmind.com:8443/api/health
```

**Expected response:**
```json
{"status":"OK","message":"Server is running","timestamp":"..."}
```

### Step 4: Update Vercel Environment Variable

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `fer-henna-omega`
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` and update it:
   - **Value:** `https://api.grahmind.com:8443`
5. **Save**
6. **Redeploy** your frontend:
   - Go to **Deployments** tab
   - Click "..." on latest deployment
   - Click **Redeploy**

### Step 5: Update Frontend Code (If Needed)

The frontend should automatically use the `VITE_API_URL` environment variable, but verify your code uses it:

**Check:** `frontend/src/components/pages/Login.jsx` and `Signup.jsx`

They should have:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

This is already correct! ✅

### Step 6: Test Full Flow

1. Go to: https://fer-henna-omega.vercel.app/signup
2. Try to sign up
3. Check browser console (F12) - should NOT see Mixed Content error
4. Check if user is saved in MongoDB

## Summary

**What Changed:**
- ✅ Added new port forwarding: External 8443 → Internal 443 (192.168.0.233)
- ✅ Updated Vercel: `VITE_API_URL=https://api.grahmind.com:8443`
- ✅ Existing port 443 rule unchanged (still points to 192.168.0.74)

**Your Backend URL:**
- `https://api.grahmind.com:8443`

**Both Services Work:**
- Port 443 → 192.168.0.74 (HANAATTP GCP) ✅
- Port 8443 → 192.168.0.233 (Your Backend API) ✅

## Troubleshooting

### If port 8443 doesn't work:
- Try a different port: `9443`, `8444`, `8445`
- Make sure the rule is enabled (Status: ON)
- Wait 2-3 minutes for router to apply
- Check firewall on server: `sudo ufw allow 8443/tcp`

### If you get SSL errors:
- The certificate is for `api.grahmind.com`, so it should work on any port
- Browser might show a warning if using a non-standard port, but it should still work

