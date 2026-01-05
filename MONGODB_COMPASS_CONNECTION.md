# Connect to MongoDB using MongoDB Compass

## Option 1: Direct Connection (If Port 27017 is Exposed)

**⚠️ WARNING**: This is **NOT RECOMMENDED** for security reasons. MongoDB should not be exposed to the internet.

If your router has port forwarding for 27017 (which you should NOT have), you could use:

```
mongodb://admin:Artihcus%40123@97.77.20.150:27017/myapp?authSource=admin
```

**But this is UNSAFE!** Don't do this in production.

## Option 2: SSH Tunnel (RECOMMENDED - Secure)

Since MongoDB port 27017 is not exposed (and shouldn't be), use an SSH tunnel:

### Step 1: Create SSH Tunnel

On your **local machine** (Windows), open PowerShell or Command Prompt:

```bash
ssh -L 27018:localhost:27017 root@97.77.20.150
```

This creates a tunnel:
- **Local port**: 27018 (on your computer)
- **Remote**: localhost:27017 (on the server)
- **Server**: 97.77.20.150

**Keep this terminal window open** while using Compass!

### Step 2: Connect in MongoDB Compass

In MongoDB Compass, use this connection string:

```
mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin
```

**Important**: Use `localhost:27018` (the local tunnel port), NOT the server IP!

### Step 3: Click "Connect"

You should now see your databases and collections in Compass!

## Connection String Breakdown

```
mongodb://[username]:[password]@[host]:[port]/[database]?authSource=[authDatabase]
```

- **username**: `admin`
- **password**: `Artihcus@123` (URL-encoded as `Artihcus%40123`)
- **host**: `localhost` (when using SSH tunnel) or `97.77.20.150` (if exposed - NOT recommended)
- **port**: `27018` (SSH tunnel) or `27017` (direct - NOT recommended)
- **database**: `myapp`
- **authSource**: `admin`

## Quick Steps Summary

1. **Open terminal on your local machine**
2. **Create SSH tunnel**:
   ```bash
   ssh -L 27018:localhost:27017 root@97.77.20.150
   ```
3. **Keep terminal open**
4. **Open MongoDB Compass**
5. **Paste connection string**:
   ```
   mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin
   ```
6. **Click "Connect"**
7. **Browse your database!**

## What You'll See in Compass

- **Database**: `myapp`
- **Collection**: `users`
- **Documents**: All your signup users with:
  - `_id`: MongoDB ObjectId
  - `username`: User's username
  - `email`: User's email
  - `password`: Hashed password (bcrypt)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp

## Troubleshooting

### "Connection refused" error
- Make sure SSH tunnel is running
- Check that MongoDB is running on server: `sudo systemctl status mongod`

### "Authentication failed" error
- Double-check password: `Artihcus@123` (encoded as `Artihcus%40123`)
- Verify username is `admin`
- Check `authSource=admin` is in connection string

### Can't see `myapp` database
- The database is created automatically when first user signs up
- If no users exist yet, create one via your frontend signup page
- Or manually create it: `use myapp` in mongosh

### SSH tunnel keeps disconnecting
- Use `-N` flag to prevent SSH from executing commands:
  ```bash
  ssh -N -L 27018:localhost:27017 root@97.77.20.150
  ```
- Or use `-f` to run in background:
  ```bash
  ssh -f -N -L 27018:localhost:27017 root@97.77.20.150
  ```

## Alternative: Using PuTTY (Windows)

If you prefer PuTTY:

1. **Open PuTTY**
2. **Session**:
   - Host: `97.77.20.150`
   - Port: `22`
3. **Connection → SSH → Tunnels**:
   - Source port: `27018`
   - Destination: `localhost:27017`
   - Click "Add"
4. **Click "Open"** and login
5. **In Compass**, use: `mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin`

