import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health check route (works even without MongoDB)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  })
})

// MongoDB connection (non-blocking for local dev)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp'
const PORT = process.env.PORT || 5000

// Try to connect to MongoDB, but don't exit if it fails (for local dev)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed (running without DB):', error.message)
    console.log('💡 Server will still run, but auth features won\'t work')
  })

// Start server regardless of MongoDB connection
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Access at http://localhost:${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
})

export default app

