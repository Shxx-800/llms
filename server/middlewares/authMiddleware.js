import { clerkClient } from "@clerk/express"

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false, 
        message: 'Authentication required'
      })
    }

    const userId = req.auth.userId
    
    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId)
    
    if (!user) {
      return res.status(404).json({
        success: false, 
        message: 'User not found'
      })
    }

    // Check if user has educator role
    if (user.publicMetadata?.role !== 'educator') {
      return res.status(403).json({
        success: false, 
        message: 'Educator access required. Please request educator role first.'
      })
    }
    
    // Add user info to request for use in controllers
    req.user = user
    next()

  } catch (error) {
    console.error('Educator auth middleware error:', error)
    
    // Handle specific Clerk errors
    if (error.status === 404) {
      return res.status(404).json({
        success: false, 
        message: 'User not found in authentication system'
      })
    }
    
    return res.status(500).json({
      success: false, 
      message: 'Authentication service error'
    })
  }
}

// Middleware to protect admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false, 
        message: 'Authentication required'
      })
    }

    const userId = req.auth.userId
    
    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId)
    
    if (!user) {
      return res.status(404).json({
        success: false, 
        message: 'User not found'
      })
    }

    // Check if user has admin role
    if (user.publicMetadata?.role !== 'admin') {
      return res.status(403).json({
        success: false, 
        message: 'Admin access required'
      })
    }
    
    // Add user info to request for use in controllers
    req.user = user
    next()

  } catch (error) {
    console.error('Admin auth middleware error:', error)
    
    // Handle specific Clerk errors
    if (error.status === 404) {
      return res.status(404).json({
        success: false, 
        message: 'User not found in authentication system'
      })
    }
    
    return res.status(500).json({
      success: false, 
      message: 'Authentication service error'
    })
  }
}

// Middleware to protect user routes (basic authentication)
export const protectUser = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false, 
        message: 'Authentication required'
      })
    }

    const userId = req.auth.userId
    
    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId)
    
    if (!user) {
      return res.status(404).json({
        success: false, 
        message: 'User not found'
      })
    }
    
    // Add user info to request for use in controllers
    req.user = user
    next()

  } catch (error) {
    console.error('User auth middleware error:', error)
    
    // Handle specific Clerk errors
    if (error.status === 404) {
      return res.status(404).json({
        success: false, 
        message: 'User not found in authentication system'
      })
    }
    
    return res.status(500).json({
      success: false, 
      message: 'Authentication service error'
    })
  }
}