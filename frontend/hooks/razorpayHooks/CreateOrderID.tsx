const gnenerateRazorpayOrderID = async () => {
    const generateRazorpayOrderIDAPICall = async (amount:number , currency:string = "INR") => {
        try {
            const response = await fetch("http://localhost:8000/api/razorpay/OrderID", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount, currency }),
            });
            const result = await response.json();   
            return result;
        }
        catch (error) {
            return {success: false, message: `Error during Razorpay Order ID generation: ${error}`};
        }
    }
    return { generateRazorpayOrderIDAPICall };
}
export default gnenerateRazorpayOrderID;