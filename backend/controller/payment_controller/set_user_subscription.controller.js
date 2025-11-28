import UserSubscription from "../../models/user_subscription.model.js";
import Users from "../../models/users.model.js";

const calculateEndDate = (subscriptionPlan) => {
    const start = new Date();
    const end = new Date(start);

    if (subscriptionPlan === "monthly") {
        end.setMonth(end.getMonth() + 1);
    } else {
        end.setFullYear(end.getFullYear() + 1);
    }

    return end;
};

export const set_user_subscription = async (req, res) => {
    try {
        const {
            email,
            payment_id,
            productName,
            subscriptionType,
            subscriptionPlan,
        } = await req.body;

        if (!payment_id ) {
            return res.status(400).json({
                success: false,
                message: "Cannot process your request. Missing payment ID."
            });
        }

        const endDate = calculateEndDate(subscriptionPlan);

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This User not found.Subscription can't be created."
            });
        }

        let userSubscriptionDetail = await UserSubscription.findOne({ email });

        // CASE 1: userSubscriptionDetail NOT FOUND → CREATE USER WITH FIRST SUBSCRIPTION
        if (!userSubscriptionDetail) {
            userSubscriptionDetail = await UserSubscription.create({
                email,
                subscriptions: [{
                    payment_id,
                    productName,
                    subscriptionType,
                    subscriptionPlan,
                    startDate: new Date(),
                    endDate,
                    isActive: true
                }]
            });

            user.subscriptions.push(userSubscriptionDetail._id);
            await user.save();

            return res.status(201).json({
                success: true,
                message: "Subscription created successfully",
                data: userSubscriptionDetail
            });
        }

        // CASE 2: userSubscriptionDetail EXISTS → CHECK IF PRODUCT EXISTS
        const index = userSubscriptionDetail.subscriptions.findIndex(
            sub => sub.productName === productName
        );

        // A. PRODUCT NOT FOUND → ADD NEW SUBSCRIPTION
        if (index === -1) {
            userSubscriptionDetail.subscriptions.push({
                payment_id,
                productName,
                subscriptionType,
                subscriptionPlan,
                startDate: new Date(),
                endDate,
                isActive: true
            });

            await userSubscriptionDetail.save();

            return res.json({
                success: true,
                message: "New product subscription added",
                data: userSubscriptionDetail
            });
        }

        // B. PRODUCT FOUND → Apply CHhanges
        const existingSub = userSubscriptionDetail.subscriptions[index];

        // if isActive is false, allow any change
        if (!existingSub.isActive) {
            userSubscriptionDetail.subscriptions[index].payment_id = payment_id;
            userSubscriptionDetail.subscriptions[index].subscriptionType = subscriptionType;
            userSubscriptionDetail.subscriptions[index].subscriptionPlan = subscriptionPlan;
            userSubscriptionDetail.subscriptions[index].startDate = new Date();
            userSubscriptionDetail.subscriptions[index].endDate = endDate;
            userSubscriptionDetail.subscriptions[index].isActive = true;
            await userSubscriptionDetail.save();

            return res.json({
                success: true,
                message: `Congrates you subscribed again to ${subscriptionType} plan`,
                data: userSubscriptionDetail
            });
        }

        // C. VALID UPGRADE → APPLY UPDATE
        userSubscriptionDetail.subscriptions[index].payment_id = payment_id;
        userSubscriptionDetail.subscriptions[index].subscriptionType = subscriptionType;
        userSubscriptionDetail.subscriptions[index].subscriptionPlan = subscriptionPlan;
        userSubscriptionDetail.subscriptions[index].startDate = new Date();
        userSubscriptionDetail.subscriptions[index].endDate = endDate;
        userSubscriptionDetail.subscriptions[index].isActive = true;

        await userSubscriptionDetail.save();

        return res.json({
            success: true,
            message: `Subscription upgraded to ${subscriptionType} plan`,
            data: userSubscriptionDetail
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to set user subscription",
            error_message: error.message
        });
    }
};
