#!/bin/bash
# MongoDB Setup Script for Docker
# This script sets up MongoDB with authentication

echo "Setting up MongoDB with authentication..."

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
sleep 10

# Create application user
docker exec -it mongodb mongosh -u ${MONGO_ROOT_USERNAME:-admin} -p ${MONGO_ROOT_PASSWORD} --authenticationDatabase admin <<EOF
use myapp
db.createUser({
  user: "${MONGO_APP_USERNAME:-appuser}",
  pwd: "${MONGO_APP_PASSWORD}",
  roles: [ { role: "readWrite", db: "myapp" } ]
})
exit
EOF

echo "MongoDB setup complete!"
echo "Application user created: ${MONGO_APP_USERNAME:-appuser}"

