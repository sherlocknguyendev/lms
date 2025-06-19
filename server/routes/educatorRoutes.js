
import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRoutes = express.Router();

// Add Educator Role
educatorRoutes.get('/update-role', updateRoleToEducator);
educatorRoutes.post('/add-course', upload.single('image'), protectEducator, addCourse);
educatorRoutes.get('/courses', protectEducator, getEducatorCourses);
educatorRoutes.get('/dashboard', protectEducator, educatorDashboardData);
educatorRoutes.get('/enrolled-students', protectEducator, getEnrolledStudentsData);



export default educatorRoutes;