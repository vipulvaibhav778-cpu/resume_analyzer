import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

export const GenerateRazorpayOrderID = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;

        const order = await razorpay.orders.create({
            amount: amount, // amount in paise
            currency,
            receipt: `rcpt_${Date.now()}`,
        });

        return res.json({ success: true, message: "Successfully extablished connection to Razorpay Order ID API", orderId: order.id })
    } catch (error) {
        return res.json({ success: false, message: "Razorpay Order ID API failed", error_message: error.message })
    }
}

export const RazorPayPaymentVerification = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        // ---- Verify Signature ----
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            return res.json({
                success: true,
                payment_id: razorpay_payment_id,
                message: "Payment verified successfully."
            });
        }

        // ---- Verification failed → initiate refund ----
        await razorpay.payments.refund(razorpay_payment_id);

        return res.json({
            success: false,
            payment_id: razorpay_payment_id,
            message: "Signature mismatch. Payment refunded."
        });

    } catch (error) {
        return res.json({ success: false, payment_id: null, message: "Razorpay Payment Verification API failed", error_message: error.message })
    }
}