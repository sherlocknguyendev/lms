
import mongoose from "mongoose";

// Tạo cấu trúc (Scheme) User ở database (khi tạo user cần dựa vào cấu trúc này)
const UserScheme = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        imageUrl: { type: String, required: true },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ]
    }, { timestamps: true });


// Tạo User Model
const User = mongoose.model('User', UserScheme);
export default User

