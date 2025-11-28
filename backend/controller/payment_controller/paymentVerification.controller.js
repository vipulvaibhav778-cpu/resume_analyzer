import ProductSubscriptionDetail from "../../models/product_subscription_detail.model.js";
import Users from "../../models/users.model.js";
import UserSubscription from "../../models/user_subscription.model.js";

const paymentAlterationCheck = (subscriptionType, subscriptionPlan, payment_amount, productSubscriptionDetail) => {
    if (subscriptionType === "basic" && ((subscriptionPlan === "monthly" && payment_amount !== productSubscriptionDetail.basic.monthly) || (subscriptionPlan === "yearly" && payment_amount !== productSubscriptionDetail.basic.yearly)) ||
        subscriptionType === "premium" && ((subscriptionPlan === "monthly" && payment_amount !== productSubscriptionDetail.premium.monthly) || (subscriptionPlan === "yearly" && payment_amount !== productSubscriptionDetail.premium.yearly)) ||
        subscriptionType === "enterprise" && ((subscriptionPlan === "monthly" && payment_amount !== productSubscriptionDetail.enterprise.monthly) || (subscriptionPlan === "yearly" && payment_amount !== productSubscriptionDetail.enterprise.yearly))) {
        return res.status(400).json({
            success: false,
            message: "Payment amount has been altered. Subscription creation failed. Reporting to admin."
        });
    }
}

export const paymentVerificationAPI = async (req, res) => {
    try {
        const {
            email,
            productName,
            subscriptionType,
            subscriptionPlan,
            payment_amount
        } = await req.body;

        if (!email || !productName || !subscriptionType || !subscriptionPlan || !payment_amount) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong. Please try again later."
            });
        }

        // Product subscription detail fetching
        const productSubscriptionDetail = await ProductSubscriptionDetail.findOne({ productName });

        // userSubscriptionDetail fetching
        let userSubscriptionDetail = await UserSubscription.findOne({ email });

        if (!productSubscriptionDetail) {
            return res.status(404).json({
                success: false,
                message: "The product or services you want to subscribe to does not exist"
            });
        }

        if (!userSubscriptionDetail) {
            paymentAlterationCheck(subscriptionType, subscriptionPlan, payment_amount, productSubscriptionDetail, res);
            return res.status(200).json({
                success: true,
                message: "You can proceed to create subscription"
            });
        }

        // Checking if user already has subscription to the same product
        const index = await userSubscriptionDetail.subscriptions.findIndex(
            sub => sub.productName === productName
        );

        if (index === -1) {
            paymentAlterationCheck(subscriptionType, subscriptionPlan, payment_amount, productSubscriptionDetail, res);
            return res.status(200).json({
                success: true,
                message: "You can proceed to create subscription"
            });
        }

        const existingSub = userSubscriptionDetail.subscriptions[index];

        // Checking if user exists or not
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This User not found.Subscription can't be created."
            });
        }
        
        if (!existingSub.isActive) {
            paymentAlterationCheck(subscriptionType, subscriptionPlan, payment_amount, productSubscriptionDetail, res);
            return res.status(200).json({
                success: true,
                message: "You can proceed to create subscription"
            });
        }

        const subscriptionRanks = {
            basic: 1,
            premium: 2,
            enterprise: 3
        };

        const subscriptionPlanRank ={
            monthly:1,
            yearly:2
        }

        const oldRank = subscriptionRanks[existingSub.subscriptionType];
        const newRank = subscriptionRanks[subscriptionType];


        if (newRank === oldRank) {
            if(subscriptionPlanRank[existingSub.subscriptionPlan]<subscriptionPlanRank[subscriptionPlan]){
                return res.status(200).json({
                    success: true,
                    message: "You can proceed to upgrade subscription"
                });
            }
            return res.status(400).json({
                success: false,
                message: `User already has ${existingSub.subscriptionType} plan for this product`
            });
        }

        if (newRank < oldRank) {
            return res.status(400).json({
                success: false,
                message: `Cannot downgrade subscription from ${existingSub.subscriptionType} to ${subscriptionType}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "You can proceed to create subscription"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Payment Verification API failed", error_message: error.message })
    }
}