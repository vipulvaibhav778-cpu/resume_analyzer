interface paymentDataType {
    email: string,
    payment_id: string,
    productName: string,
    subscriptionType: string,
    subscriptionPlan: string,
    payment_amount: number
}
const paymentInfoStoreAPIFunction = () => {
    const paymentInfoStoreAPICall = async (paymentData: paymentDataType) => {
        try {
            if (!HandleError(paymentData)) {
                return { success: false, message: "Invalid payment data" };
            }

            const response = await fetch("http://localhost:8000/api/userSubscription/set", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: `Error storing payment info: ${error}` };
        }
    }
    return { paymentInfoStoreAPICall };
}

function HandleError(paymentData: paymentDataType): boolean {
    if (!paymentData.email || !paymentData.payment_id || !paymentData.productName || !paymentData.subscriptionType || !paymentData.subscriptionPlan || !paymentData.payment_amount) {
        return false;
    }
    return true;
}

export default paymentInfoStoreAPIFunction;