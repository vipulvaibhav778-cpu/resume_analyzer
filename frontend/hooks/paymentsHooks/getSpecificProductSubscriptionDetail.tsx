const getUserSubscriptionForSpecifProduct = () => {
    const getUserSubscriptionForSpecifProductFunc = async (email: string, productName: string) => {
        try {
            const response = await fetch("http://localhost:8000/api/getSpecificProductSubscriptionDetail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, productName }),
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: `Error fetching user subscription: ${error}` };
        }
    }

    return { getUserSubscriptionForSpecifProductFunc };
}

export default getUserSubscriptionForSpecifProduct;