interface verifyDataTypes{
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}
const VerifyRazorPayPayment = () => {

    const verifyRazorPayPaymentAPICall = async (verifyData: verifyDataTypes) => {
        try {
            const response = await fetch("http://localhost:8000/api/razorpay/Verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(verifyData),
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: `Error during Razorpay Payment Verification: ${error}` };
        }
    }

    return { verifyRazorPayPaymentAPICall };
}

export default VerifyRazorPayPayment;