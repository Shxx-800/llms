import express from 'express'
import { protectUser } from '../middlewares/authMiddleware.js'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js';


const userRouter = express.Router()

// Protected user routes (require authentication)
userRouter.get('/data', protectUser, getUserData)
userRouter.post('/purchase', protectUser, purchaseCourse)
userRouter.get('/enrolled-courses', protectUser, userEnrolledCourses)
userRouter.post('/update-course-progress', protectUser, updateUserCourseProgress)
userRouter.post('/get-course-progress', protectUser, getUserCourseProgress)
userRouter.post('/add-rating', protectUser, addUserRating)

// Health check for user routes
userRouter.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User routes are working',
    timestamp: new Date().toISOString()
  })
})

export default userRouter;