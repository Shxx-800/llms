import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'
import adminRouter from './routes/adminRoutes.js'

// Initialize Express
const app = express()

// Port configuration
const PORT = process.env.PORT || 5000

// Basic middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))

// Webhook routes (must be before express.json() middleware)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// JSON middleware for other routes
app.use(express.json())

// Clerk middleware for protected routes
app.use(clerkMiddleware())

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "API Working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/admin', adminRouter)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message 
  })
})

// Start server function
const startServer = async () => {
  try {
    console.log('🚀 Starting server...')
    
    // Connect to MongoDB first
    console.log('📦 Connecting to MongoDB...')
    await connectDB()
    
    // Connect to Cloudinary
    console.log('☁️  Connecting to Cloudinary...')
    await connectCloudinary()
    
    // Start the server only after successful connections
    app.listen(PORT, () => {
      console.log('✅ Server started successfully!')
      console.log(`🌐 Server running on: http://localhost:${PORT}`)
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
      console.log('📋 Available routes:')
      console.log('   - GET  / (Health check)')
      console.log('   - POST /clerk (Clerk webhooks)')
      console.log('   - POST /stripe (Stripe webhooks)')
      console.log('   - /api/user/* (User routes)')
      console.log('   - /api/course/* (Course routes)')
      console.log('   - /api/educator/* (Educator routes)')
      console.log('   - /api/admin/* (Admin routes)')
      console.log('🎉 Ready to accept connections!')
    })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message)
  console.error('Stack trace:', err.stack)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message)
  console.error('Stack trace:', err.stack)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...')
  process.exit(0)
})

// Start the server
startServer()