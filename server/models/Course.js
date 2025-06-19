

import mongoose from "mongoose";



const lectureScheme = new mongoose.Schema({
    lectureId: { type: String, require: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true }
}, { _id: false });



const chapterScheme = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureScheme]
}, { _id: false });



// Tạo cấu trúc (Scheme) Course ở database (khi tạo Course cần dựa vào cấu trúc này)
const CourseScheme = new mongoose.Schema(
    {
        courseTitle: { type: String, required: true },
        courseDescription: { type: String, required: true },
        courseThumbnail: { type: String },
        coursePrice: { type: Number, required: true },
        isPublished: { type: Boolean, default: true },
        discount: { type: Number, required: true, min: 0, max: 100 },
        courseContent: [chapterScheme],
        courseRatings: [
            { userId: { type: String }, rating: { type: Number, min: 1, max: 5 } }
        ],
        educator: { type: String, ref: 'User', required: true },
        enrolledStudents: [
            { type: String, ref: 'User' }
        ]
    }, { timestamps: true, minimize: false });




// Tạo Course Model
const Course = mongoose.model('Course', CourseScheme);
export default Course;

