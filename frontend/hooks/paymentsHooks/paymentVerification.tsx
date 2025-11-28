interface paymentDataTypes {
    email: string,
    productName: string,
    subscriptionType: string,
    subscriptionPlan: string,
    payment_amount: number
}
const paymentVerification = async () => {
    const paymentVerificationAPICall = async (paymentData: paymentDataTypes) => {
        try {
            if (!HandleError(paymentData)) {
                return {success: false, message: "Invalid payment data"};
            }

            const response = await fetch("http://localhost:8000/api/paymentVerification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });
            const result = await response.json();   
            return result;
        }
        catch (error) {
            return {success: false, message: `Error during payment verification: ${error}`};
        }
    }
    return { paymentVerificationAPICall };
};

function HandleError(paymentData: paymentDataTypes): boolean {
    if (!paymentData.email || !paymentData.productName || !paymentData.subscriptionType || !paymentData.subscriptionPlan || !paymentData.payment_amount) {
        return false;
    }
    return true;
}

export default paymentVerification;