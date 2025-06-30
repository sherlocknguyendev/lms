
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRoutes from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// Initialize Express
const app = express();


// Connect to database
await connectDB();


// Connect to Cloudinary Storage 
await connectCloudinary();

// Middlewares
app.use(cors()); // accept all domain access data each other
// app.use(express.json()) // Chuyển đổi request body từ JSON string thành JavaScript object (phải là JS Object thì BE mới xử lý được)
app.use(clerkMiddleware()) // thêm property 'auth' vào req; verify token


// Routes
app.get('/', (req, res) => res.send('BackEnd are working from SherlockNguyenDev'));
app.use('/api/educator', express.json(), educatorRoutes);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter)

app.post('/clerk', express.json(), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Hello guys from BE: ${PORT}`)
});