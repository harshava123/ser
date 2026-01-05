# Alternative Ways to View MongoDB Data

## Option 1: MongoDB Shell (mongosh) - Command Line

### Connect and View:
```bash
# Connect to MongoDB
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp?authSource=admin"

# Once connected:
use myapp
db.users.find().pretty()
```

### One-liner commands:
```bash
# View all users
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp?authSource=admin" --eval "db.users.find().pretty()"

# Count users
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp?authSource=admin" --eval "db.users.countDocuments()"

# View users (username and email only)
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp?authSource=admin" --eval "db.users.find({}, {username: 1, email: 1, _id: 1}).pretty()"
```

## Option 2: Web-Based MongoDB Admin (mongo-express)

Install a web-based MongoDB admin tool on your server:

### Install mongo-express using Docker:

```bash
cd /data/backend

# Create docker-compose file for mongo-express
cat > docker-compose-mongo-express.yml << 'EOF'
version: '3.8'

services:
  mongo-express:
    image: mongo-express:latest
    container_name: mongo-express
    restart: unless-stopped
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: Artihcus@123
      ME_CONFIG_MONGODB_URL: mongodb://admin:Artihcus%40123@host.docker.internal:27017/
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: admin123
    network_mode: host
EOF

# Start mongo-express
docker-compose -f docker-compose-mongo-express.yml up -d
```

### Access mongo-express:
1. Open browser: `http://97.77.20.150:8081`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Browse databases and collections!

**Note**: You'll need to add port forwarding for 8081 on your router if accessing from outside.

## Option 3: Studio 3T (Free GUI Tool)

Similar to Compass but different interface:

1. **Download**: https://studio3t.com/download/
2. **Install** on your local machine
3. **Create SSH tunnel** (same as Compass):
   ```bash
   ssh -L 27018:localhost:27017 root@97.77.20.150
   ```
4. **Connect** using:
   - Host: `localhost`
   - Port: `27018`
   - Username: `admin`
   - Password: `Artihcus@123`
   - Auth Database: `admin`

## Option 4: NoSQLBooster (Free GUI Tool)

1. **Download**: https://www.nosqlbooster.com/downloads
2. **Install** on your local machine
3. **Create SSH tunnel**:
   ```bash
   ssh -L 27018:localhost:27017 root@97.77.20.150
   ```
4. **Connect** using connection string:
   ```
   mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin
   ```

## Option 5: Create a Simple Admin API Endpoint

Add a simple endpoint to your backend to view users (for development only!):

### Add to `routes/auth.js`:

```javascript
// Add this route (ONLY FOR DEVELOPMENT - REMOVE IN PRODUCTION!)
router.get('/users', async (req, res) => {
  try {
    // Add basic auth check here in production!
    const users = await User.find({}, { password: 0 }) // Exclude password
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
})
```

### Access via browser or curl:
```bash
# From server
curl http://localhost:5000/api/auth/users

# From your local machine (if port forwarded)
curl http://97.77.20.150:5000/api/auth/users
```

**⚠️ WARNING**: This exposes user data! Only use for development and add authentication!

## Option 6: VS Code Extension

If you use VS Code:

1. **Install Extension**: "MongoDB for VS Code"
2. **Create SSH tunnel**:
   ```bash
   ssh -L 27018:localhost:27017 root@97.77.20.150
   ```
3. **Connect** in VS Code:
   - Click MongoDB icon in sidebar
   - Add connection: `mongodb://admin:Artihcus%40123@localhost:27018/myapp?authSource=admin`
   - Browse collections directly in VS Code!

## Option 7: Simple HTML Admin Page

Create a simple admin page served by your backend:

### Create `public/admin.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>MongoDB Admin</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>Users Database</h1>
    <div id="users"></div>
    <script>
        fetch('/api/auth/users')
            .then(r => r.json())
            .then(users => {
                const html = `
                    <table>
                        <tr><th>ID</th><th>Username</th><th>Email</th><th>Created</th></tr>
                        ${users.map(u => `
                            <tr>
                                <td>${u._id}</td>
                                <td>${u.username}</td>
                                <td>${u.email}</td>
                                <td>${u.createdAt}</td>
                            </tr>
                        `).join('')}
                    </table>
                `
                document.getElementById('users').innerHTML = html
            })
    </script>
</body>
</html>
```

### Add route in `server.js`:
```javascript
app.use(express.static('public'))
```

### Access:
- `http://97.77.20.150:5000/admin.html`

## Recommendation

**For Quick Viewing**: Use **mongosh** (Option 1) - it's already installed on your server.

**For Visual Browsing**: Use **mongo-express** (Option 2) - web-based, no installation needed on your local machine.

**For Development**: Use **VS Code Extension** (Option 6) - if you already use VS Code.

