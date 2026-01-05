import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()

// Middleware - CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['https://fer-henna-omega.vercel.app', 'http://localhost:5173', 'http://localhost:3000']

app.use(cors({
  origin: function (origin, callback) {
    // Debug logging
    console.log('🔍 CORS check - Origin received:', origin)
    console.log('🔍 CORS check - Allowed origins:', allowedOrigins)
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('🔍 CORS check - No origin, allowing')
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      // Explicitly return the origin to set the header correctly
      console.log('✅ CORS check - Origin allowed, returning:', origin)
      callback(null, origin)
    } else {
      console.log('❌ CORS check - Origin not allowed:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp'
const PORT = process.env.PORT || 5000

// Try to connect to MongoDB, but allow server to run without it for local dev
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed:', error.message)
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Exiting in production mode')
      process.exit(1)
    } else {
      console.log('💡 Running in development mode without MongoDB')
    }
  })

// Start server regardless of MongoDB connection (for local dev)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Access at http://localhost:${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
})

export default app
