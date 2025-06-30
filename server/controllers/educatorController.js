
import { clerkClient } from '@clerk/express'
import { v2 as cloudinary } from 'cloudinary';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';


// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId; // sau khi verify token thì lưu vào userIduserId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        });
        res.json({ success: true, message: 'You can publish a course now!' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};



// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' });
        };

        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({ success: true, message: 'Course Added' });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        res.json({ success: true, courses });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

};


// Get Educator Dashboard Data  (Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchase
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        // Đếm enrollments (lượt đăng ký) (tính tất cả các course lại)
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents },
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })

        };

        return res.json({
            success: true,
            dataDashboard: {
                totalCourses,
                totalEarnings,
                enrolledStudentsData
            }
        });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

};


// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {

    try {

        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        // tìm tất cả các khóa học có status = 'completed'
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
            .populate('userId', 'name imageUrl') // populate() = JOIN của MongoDB, giúp lấy related data trong 1 query (trỏ đến userId ở Purchase Schema, và userId ở đó trỏ đến User Scheme, và chỉ lấy name và imageUrl) (biển từ 1 objecId thành object thật)
            .populate('courseId', 'courseTitle')


        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        return res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {

        return res.json({ success: false, message: error.message });

    }
};
