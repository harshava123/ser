# Backend with MongoDB Atlas

If you're using **MongoDB Atlas** (cloud database), use this setup instead.

## Setup

1. **Set up MongoDB Atlas first** - See `../MONGODB_ATLAS_SETUP.md`

2. **Create `.env` file** with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-secure-secret-key-here
```

3. **Use the Atlas-specific docker-compose file:**
```bash
docker-compose -f docker-compose.atlas.yml up -d
```

Or for local development:
```bash
npm install
npm run dev
```

## Benefits

✅ No MongoDB installation needed
✅ No port 27017 required
✅ Automatic backups
✅ Easier deployment
✅ Works from anywhere

## Notes

- The `docker-compose.atlas.yml` file doesn't include MongoDB service
- All MongoDB connection is handled via the connection string in `.env`
- Make sure your server IP is whitelisted in MongoDB Atlas

