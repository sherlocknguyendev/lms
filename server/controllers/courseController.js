
import Course from "../models/Course.js";

// Get All Courses
export const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({
            isPublished: true
        })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator' }) // educator tham chiếu đến model User, và lấy toàn bộ thông tin

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};


// Get Course by ID
export const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' })

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = '';
                }
            })
        })

        res.json({ success: true, courseData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

