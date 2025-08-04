import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = async () => {
  try {
    // Check if all required Cloudinary credentials are provided
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
      throw new Error('Missing Cloudinary credentials in environment variables')
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
    
    // Test the connection
    const result = await cloudinary.api.ping()
    console.log('✅ Cloudinary Connected:', result.status)
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message)
    throw error
  }

}

export default connectCloudinary