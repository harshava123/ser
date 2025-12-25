# Backend Server

Node.js backend with Express, MongoDB, and JWT authentication.

## Setup Instructions

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/myapp
PORT=5000
JWT_SECRET=your-secret-key
```

4. Make sure MongoDB is running locally, then start the server:
```bash
npm run dev
```

### Docker Setup

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

This will start both MongoDB and the backend server.

2. To stop:
```bash
docker-compose down
```

3. To view logs:
```bash
docker-compose logs -f
```

## API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens

