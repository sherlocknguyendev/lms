
import { Webhook } from "svix";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import Stripe from 'stripe';

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.create(userData)
                res.json({ message: "create user" })
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data._id, userData)
                res.json({ message: "update user" })
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data._id)
                res.json({ message: "delete user" })
                break;
            }

            default:
                break;
        }

    } catch (error) {
        res.json({ message: error.message })
    }
}


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Đây là đoạn backend xử lý webhook khi Stripe chủ động gửi thông báo về trạng thái thanh toán (thành công hoặc thất bại).
export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );


    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    const paymentIntent = event.data?.object;
    const paymentIntentId = paymentIntent?.id;
    const purchaseId = paymentIntent?.metadata?.purchaseId;

    if (!purchaseId) {
        console.warn("⚠️ purchaseId not found in paymentIntent metadata");
        return response.status(200).send("Ignored: No purchaseId");
    }

    try {
        if (event.type === 'payment_intent.succeeded') {

            const purchaseData = await Purchase.findById(purchaseId);
            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            courseData.enrolledStudents.push(userData._id);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchaseData.status = 'completed';
            await purchaseData.save();


        } else if (event.type === 'payment_intent.payment_failed') {

            const purchaseData = await Purchase.findById(purchaseId);
            purchaseData.status = 'failed';
            await purchaseData.save();
        } else {
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return response.status(200).json({ received: true });

    } catch (err) {
        console.error("💥 Error in webhook handler:", err);
        return response.status(200).send("Webhook received with error");
    }
};
