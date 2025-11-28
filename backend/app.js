import express from 'express';
import dotenv from "dotenv";
import cors from "cors"
import testingRoutes from './routes/testing.js'
import ResumeHandling from './routes/resume_analysis_routes/resumeHandling.js'
import getRecentDetail from './routes/resume_analysis_routes/getRecentDetail.js'
import getDocuments from './routes/resume_analysis_routes/getDocuments.js'
import contactFormAPI from './routes/contactForm.js'
import connectMongoDb from './db/connectDB.js';
import blogUpload from './routes/blogUpload.js';
import getBlogs from './routes/getBlogs.js';
import valiadateAdmin from './routes/AdminRoutes/ValiddateAdmin.js';
import registerUser from './routes/registerUser.js';
import productPricing from './routes/payment_route/productPricing.js';
import userSubscription from './routes/payment_route/user_subscription.js';
import paymentVerification from './routes/payment_route/paymentVerification.js';
import RazorpayRoutes from './routes/razorpay_route/razorpayRoutes.js';
import getSpecificProductSubscriptionDetail from './routes/payment_route/getSpecifProductSubsDetail.js';
const app = express();

dotenv.config();

const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/testAPI', testingRoutes);
app.use('/api/fileHandling', ResumeHandling);
app.use('/api/getRecentDetail', getRecentDetail)
app.use('/api/getDocuments', getDocuments)
app.use('/api/contactForm', contactFormAPI)
app.use('/api/blogUpload', blogUpload)
app.use('/api/getBlogs', getBlogs)
app.use('/api/validateAdmin', valiadateAdmin)
app.use('/api/registerUser', registerUser)
app.use('/api/productPricing', productPricing)
app.use('/api/userSubscription', userSubscription)
app.use('/api/paymentVerification', paymentVerification)
app.use('/api/razorpay', RazorpayRoutes);
app.use('/api/getSpecificProductSubscriptionDetail', getSpecificProductSubscriptionDetail);

app.listen(PORT, (error) => {
    if (!error) {
        connectMongoDb();
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    }
    else
        console.log("Error occurred, server can't start", error.message);
}
);