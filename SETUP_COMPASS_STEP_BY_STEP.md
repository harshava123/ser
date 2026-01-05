# MongoDB Compass Setup - Step by Step

## Step 1: Download MongoDB Compass

1. **Go to**: https://www.mongodb.com/try/download/compass
2. **Select**: Windows (or your OS)
3. **Download** the installer
4. **Install** MongoDB Compass (just click through the installer)

## Step 2: Create SSH Tunnel

### On Windows (PowerShell or Command Prompt):

```bash
ssh -L 27018:localhost:27017 root@97.77.20.150
```

**Important**: 
- Keep this terminal window **OPEN** while using Compass
- You'll be asked for your SSH password
- The terminal will show a connection message

### Alternative: Run in Background (Windows PowerShell)

```powershell
Start-Process ssh -ArgumentList "-N", "-L", "27018:localhost:27017", "root@97.77.20.150"
```

This runs the tunnel in the background.

## Step 3: Connect in MongoDB Compass

1. **Open MongoDB Compass**
2. **In the connection string field**, paste this:

```
mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin
```

**Important Details**:
- `localhost:27018` - This is your local tunnel port (NOT the server IP!)
- `Artihcus%40123` - Password is URL-encoded (`@` becomes `%40`)
- `myapp` - Your database name
- `authSource=admin` - Authentication database

3. **Click "Connect"**

## Step 4: Browse Your Data

Once connected, you'll see:

### Left Sidebar:
- **Databases**: Click on `myapp`
- **Collections**: Click on `users`

### Main View:
- **Documents tab**: See all your users
- Each document shows:
  - `_id`: MongoDB ObjectId
  - `username`: User's username
  - `email`: User's email
  - `password`: Hashed password (bcrypt - you can't see original)
  - `createdAt`: When user signed up
  - `updatedAt`: Last update time

## Step 5: Test It

1. **Create a new user** via your frontend:
   - Go to: `https://fer-henna-omega.vercel.app/signup`
   - Sign up with a new username/email

2. **In Compass**:
   - Click the **Refresh** button (circular arrow icon)
   - You should see the new user appear!

## Troubleshooting

### "Connection refused" error
- **Check**: Is SSH tunnel running? (Keep the terminal open!)
- **Fix**: Make sure the `ssh -L` command is still running

### "Authentication failed" error
- **Check**: Password encoding - must be `Artihcus%40123` (not `Artihcus@123`)
- **Check**: Username is `admin`
- **Check**: `authSource=admin` is in the connection string

### Can't see `myapp` database
- **Reason**: Database is created when first user signs up
- **Fix**: Create a user via your frontend signup page first
- **Or**: The database might be empty - check if you have any users

### SSH tunnel disconnects
- **Fix**: Use `-N` flag to prevent SSH from executing commands:
  ```bash
  ssh -N -L 27018:localhost:27017 root@97.77.20.150
  ```
- **Or**: Use `-f` to run in background:
  ```bash
  ssh -f -N -L 27018:localhost:27017 root@97.77.20.150
  ```

### "Connection timeout" error
- **Check**: Can you SSH to the server normally?
- **Check**: Is MongoDB running on the server?
  ```bash
  # On server:
  sudo systemctl status mongod
  ```

## Quick Reference

**Connection String**:
```
mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin
```

**SSH Tunnel Command**:
```bash
ssh -L 27018:localhost:27017 root@97.77.20.150
```

**Keep SSH tunnel running while using Compass!**

