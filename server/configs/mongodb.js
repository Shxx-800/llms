import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    // Connection options for Mongoose 7+
    const options = {
      dbName: 'lms', // Specify database name
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options)
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB')
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('📡 Mongoose disconnected from MongoDB')
    })

    return conn

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    
    // Log specific connection errors
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Possible causes:')
      console.error('   - MongoDB server is not running')
      console.error('   - Incorrect connection string')
      console.error('   - Network connectivity issues')
      console.error('   - Firewall blocking the connection')
    }
    
    throw error
  }
}

export default connectDB