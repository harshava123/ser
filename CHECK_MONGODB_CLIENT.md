# Check MongoDB Client Availability

## Check what's installed:

```bash
# Check for mongosh (new MongoDB shell)
which mongosh

# Check for mongo (old MongoDB shell)
which mongo

# Check MongoDB version
mongod --version 2>/dev/null || echo "mongod not found"

# Check if MongoDB is running in Docker
docker ps | grep mongo
```

## Install mongosh (if needed):

### Option 1: Install via package manager
```bash
# For Ubuntu/Debian
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-mongosh
```

### Option 2: Use mongo-express (Web UI) - Easier!
This doesn't require mongosh installation.

