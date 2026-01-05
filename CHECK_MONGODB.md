# How to Check MongoDB

## 1. Connect to MongoDB

On your server, connect to MongoDB using mongosh:

```bash
# Connect with authentication
mongosh "mongodb://admin:Artihcus%40123@localhost:27017" --authenticationDatabase admin

# OR if MongoDB is running without auth on localhost
mongosh
```

## 2. List All Databases

```javascript
show dbs
```

You should see your database (likely `myapp` or similar).

## 3. Switch to Your Database

```javascript
use myapp
// or whatever database name you're using
```

To check what database name you're using, check your `.env` file:
```bash
cd /data/backend
cat .env | grep MONGODB_URI
```

The database name is usually the last part of the connection string, e.g., `mongodb://.../myapp` means database is `myapp`.

## 4. List Collections (Tables)

```javascript
show collections
```

You should see `users` collection if signups have been created.

## 5. View All Users

```javascript
db.users.find().pretty()
```

This shows all user documents in a readable format.

## 6. Count Users

```javascript
db.users.countDocuments()
```

## 7. Find Specific User

```javascript
// Find by username
db.users.findOne({ username: "your_username" })

// Find by email
db.users.findOne({ email: "your_email@example.com" })
```

## 8. View User Without Password Hash

```javascript
db.users.find({}, { username: 1, email: 1, _id: 1, createdAt: 1 }).pretty()
```

This shows only username, email, ID, and creation date (excludes password).

## 9. Exit MongoDB

```javascript
exit
```

## Quick One-Liner Commands

### Check if users collection exists and has data:
```bash
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp" --eval "db.users.countDocuments()"
```

### List all usernames:
```bash
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp" --eval "db.users.find({}, {username: 1, email: 1}).pretty()"
```

### Check latest user:
```bash
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp" --eval "db.users.find().sort({_id: -1}).limit(1).pretty()"
```

## Check MongoDB Connection from Backend

You can also check if the backend is connected to MongoDB:

```bash
cd /data/backend
docker-compose logs backend | grep -i mongo
```

You should see: `✅ Connected to MongoDB`

## Test: Create a User via Signup and Check

1. Go to your frontend: `https://fer-henna-omega.vercel.app/signup`
2. Create a new user
3. Then check MongoDB:

```bash
mongosh "mongodb://admin:Artihcus%40123@localhost:27017/myapp" --eval "db.users.find().pretty()"
```

You should see the new user document!

