import UserSubscription from "../../models/user_subscription.model.js";
export const getSpecificProductSubscription = async (req, res) => {
    try {
        const { productName, email } = await req.body;

        if (!productName || !email) {
            return res.json({
                success: false,
                message: "Product name and email are required."
            });
        }

        const userData = await UserSubscription.findOne({ email });

        if (!userData) {
            return res.json({
                success: false,
                message: "No subscriptions found for this email."
            });
        }

        const matchedSubscription = userData.subscriptions.find(
            (sub) => sub.productName.toLowerCase() === productName.toLowerCase()
        );

        if (!matchedSubscription) {
            return res.json({
                success: false,
                message: `No subscription found for product "${productName}".`
            });
        }

        return res.json({
            success: true,
            message: "Subscription details fetched successfully.",
            data: {
                productName: matchedSubscription.productName,
                subscriptionType: matchedSubscription.subscriptionType,
                subscriptionPlan: matchedSubscription.subscriptionPlan,
                startDate: matchedSubscription.startDate,
                endDate: matchedSubscription.endDate,
                isActive: matchedSubscription.isActive
            }
        });
    } catch (error) {
        return res.json({ success: false, message: "getSpecificProductSubscription API failed", error_message: error.message })
    }
}