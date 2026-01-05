# MongoDB Setup on Server

## Your MongoDB Credentials
- **Username**: `admin`
- **Password**: `Admin@123`
- **Host**: `localhost` (or `127.0.0.1`)
- **Port**: `27017`

## Connection String Format

Since your password contains special characters (`@`), it needs to be URL encoded:

```
mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin
```

**URL Encoding:**
- `@` becomes `%40`
- So `Admin@123` becomes `Admin%40123`

## Create Application Database and User

### Step 1: Connect to MongoDB

```bash
mongosh -u admin -p Admin@123 --authenticationDatabase admin
```

### Step 2: Create Application Database and User

In MongoDB shell:

```javascript
// Switch to admin database
use admin

// Create application database
use myapp

// Create application user
db.createUser({
  user: "appuser",
  pwd: "your-app-password-here",
  roles: [ { role: "readWrite", db: "myapp" } ]
})

// Verify user
db.getUsers()

// Exit
exit
```

### Step 3: Update Connection String

You can use either:

**Option A: Admin user (simpler)**
```env
MONGODB_URI=mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin
```

**Option B: Application user (more secure)**
```env
MONGODB_URI=mongodb://appuser:your-app-password@localhost:27017/myapp?authSource=myapp
```

## Test Connection

```bash
# Test with admin
mongosh "mongodb://admin:Admin%40123@localhost:27017/myapp?authSource=admin"

# Test with application user
mongosh "mongodb://appuser:password@localhost:27017/myapp?authSource=myapp"
```

## Verify MongoDB is Running

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check if MongoDB is listening
sudo netstat -tulpn | grep 27017

# View MongoDB logs
sudo journalctl -u mongod -f
```

## Security Notes

1. **Use application user** instead of admin for better security
2. **Restrict MongoDB access** - only allow localhost connections
3. **Enable firewall** - don't expose port 27017 to internet
4. **Regular backups** - set up automated backups

## Troubleshooting

### Connection refused
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Authentication failed
- Check username and password
- Verify `authSource` parameter
- Check if user exists: `db.getUsers()`

### Password with special characters
- Always URL encode special characters
- `@` = `%40`
- `#` = `%23`
- `%` = `%25`
- etc.

