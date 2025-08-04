import express from 'express'
import { 
  addCourse, 
  educatorDashboardData, 
  getEducatorCourses, 
  getEnrolledStudentsData, 
  requestEducatorRole 
} from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator, protectUser } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

// Public routes (require basic authentication)
educatorRouter.post('/request-role', protectUser, requestEducatorRole)

// Protected educator routes (require educator role)
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

// Health check for educator routes
educatorRouter.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Educator routes are working',
    timestamp: new Date().toISOString()
  })
})

export default educatorRouter