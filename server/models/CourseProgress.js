
import mongoose, { mongo } from "mongoose";

const CourseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: []
}, { minimize: false });

const CourseProgress = mongoose.model('CourseProgress', CourseProgressSchema);
export default CourseProgress;

