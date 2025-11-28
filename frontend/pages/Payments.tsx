import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from '@clerk/clerk-react';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle, FaCalendarAlt, FaCreditCard, FaArrowDown, FaHourglassHalf, FaArrowUp, FaRocket, FaCrown, FaSmileBeam } from "react-icons/fa";


import paymentVerification from '../hooks/paymentsHooks/paymentVerification.tsx';
import generateRazorpayOrderID from '../hooks/razorpayHooks/CreateOrderID.tsx';
import VerifyRazorPayPayment from "../hooks/razorpayHooks/VerifyRazorPayPayment.tsx";
import storePaymentInfo from "../hooks/paymentsHooks/storePaymentInfo.tsx"
import getUserSubscriptionDetailForSpecifProduct from "../hooks/paymentsHooks/getSpecificProductSubscriptionDetail.tsx";

type TierKey = "basic" | "premium" | "enterprise";
type PlanKey = "monthly" | "yearly";

interface TierPricing {
    monthly: number;
    yearly: number;
}

interface PricingDataTypes {
    _id: string;
    productName: string;
    basic: TierPricing;
    premium: TierPricing;
    enterprise: TierPricing;
    __v: number;
}

interface ApiResponse {
    success: boolean;
    data: PricingDataTypes;
    message?: string;
}

interface paymentDataTypes {
    email: string,
    productName: string,
    subscriptionType: string,
    subscriptionPlan: string,
    payment_amount: number
}

interface paymentToStoreTypes {
    email: string,
    productName: string,
    payment_id: string,
    subscriptionType: string,
    subscriptionPlan: string,
    payment_amount: number
}

interface existingSubscriptionDetailType {
    productName: string,
    subscriptionType: string,
    subscriptionPlan: string,
    startDate: Date,
    endDate: Date,
    isActive: boolean
}

const PaymentsPage = () => {
    const { productName } = useParams<{ productName: string }>();
    const [existingSubscriptionDetail, setExistingSubscriptionDetail] = useState<existingSubscriptionDetailType | null>(null);
    const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
    const [isPaymentDone, setisPaymentDone] = useState<boolean>(false); // Only for re-rendering purpose for smoother performance 

    const [pricingData, setPricingData] = useState<PricingDataTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedTier, setSelectedTier] = useState<TierKey>("basic");
    const [selectedPlan, setSelectedPlan] = useState<PlanKey>("monthly");

    const { isSignedIn, user } = useUser();

    const paymentVerificationAPICallFunc = paymentVerification();
    const gnenerateRazorpayOrderIDFunc = generateRazorpayOrderID();
    const verifyRazorPayPaymentAPICallFunc = VerifyRazorPayPayment();
    const storePaymentInfoAPICallFunc = storePaymentInfo();
    const getSpecificProductSubscriptionDetail = getUserSubscriptionDetailForSpecifProduct();


    useEffect(() => {
        fetchPricing();
        document.title = `${productName} - Payment`;

        // razorpay script 
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, [isPaymentDone]);

    useEffect(() => {
        if (isSignedIn)
            fetchExistingSubscription(user.primaryEmailAddress?.emailAddress || "", productName || "");
    }, [isSignedIn, isPaymentDone])

    const fetchPricing = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/productPricing/get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName }),
            });

            const result: ApiResponse = await response.json();

            if (result.success) {
                setPricingData(result.data);
            }
        } catch (error) {
            toast.error("Error while fetching pricing info")
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingSubscription = async (email: string, productName: string) => {
        const { getUserSubscriptionForSpecifProductFunc } = getSpecificProductSubscriptionDetail;
        const subscriptionResult = await getUserSubscriptionForSpecifProductFunc(email, productName);
        if (subscriptionResult.success) {
            setExistingSubscriptionDetail(subscriptionResult.data);
        }
    }

    const getFinalPrice = () => {
        if (!pricingData) return 0;

        if (existingSubscriptionDetail && existingSubscriptionDetail.isActive == true) {
            return pricingData[selectedTier][selectedPlan] - pricingData[existingSubscriptionDetail.subscriptionType as TierKey][existingSubscriptionDetail.subscriptionPlan as PlanKey];
        }

        return pricingData[selectedTier][selectedPlan];
    };

    const handlePaySubmit = async () => {
        if (!isSignedIn) {
            toast('Please sign in to proceed with the payment.', {
                icon: '⚠️',
            });
            return;
        }
        const paymentData: paymentDataTypes = {
            email: user?.primaryEmailAddress?.emailAddress || "",
            productName: productName || "",
            subscriptionType: selectedTier,
            subscriptionPlan: selectedPlan,
            payment_amount: getFinalPrice()
        };

        const { paymentVerificationAPICall } = await paymentVerificationAPICallFunc;
        const paymentAuthenticationResult = await paymentVerificationAPICall(paymentData);
        if (paymentAuthenticationResult.success) {
            toast.success(paymentAuthenticationResult.message || 'Payment verified successfully!');

            // Getting Razorpay Order ID from razorPay Hooks
            const { generateRazorpayOrderIDAPICall } = await gnenerateRazorpayOrderIDFunc;
            const result = await generateRazorpayOrderIDAPICall(getFinalPrice() * 100, "INR"); // amount in paise
            if (!result.success) {
                toast.error(`Razorpay Order ID generation failed: ${result.message || 'Unknown error'}`);
                return;
            }

            // ---- Razorpay Payment Gateway ----
            const options = {
                key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
                amount: getFinalPrice(),
                currency: "INR",
                name: productName || "Subscription",
                description: `Subscription - ${selectedTier} (${selectedPlan})`,
                image: "/logo.png", // optional
                order_id: result.orderId, // backend should return order_id
                handler: async function (response: any) {

                    // Send Razorpay response to backend for final verification
                    const verifyData = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const { verifyRazorPayPaymentAPICall } = verifyRazorPayPaymentAPICallFunc;

                    const verify = await verifyRazorPayPaymentAPICall(verifyData);

                    if (verify.success) {
                        const { paymentInfoStoreAPICall } = storePaymentInfoAPICallFunc;
                        const paymentInfoToStore = {
                            email: user?.primaryEmailAddress?.emailAddress,
                            payment_id: verify.payment_id,
                            productName: productName || "",
                            subscriptionType: selectedTier,
                            subscriptionPlan: selectedPlan,
                            payment_amount: getFinalPrice()
                        }
                        const storeResult = await paymentInfoStoreAPICall(paymentInfoToStore as paymentToStoreTypes);
                        if (storeResult.success) {
                            toast.success(storeResult.message || 'Payment and subscription activated successfully!');
                            setisPaymentDone(true)
                        } else {
                            toast.error(`Payment stored but subscription activation failed: ${storeResult.message || 'Unknown error'}`);
                        }
                    } else {
                        toast.error(`Payment verification failed: ${verify.message || 'Unknown error'}`);
                    }
                },
                theme: { color: "#9333EA" },
                modal: {
                    ondismiss: function () {
                        toast("Payment cancelled", { icon: "⚠️" });
                    }
                },
                prefill: {
                    name: user?.fullName || "",
                    email: paymentData.email
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } else {
            toast.error(`Payment verification failed: ${paymentAuthenticationResult.message || 'Unknown error'}`);
        }
    }

    return (
        <div className="flex items-center justify-center flex-col gap-2 bg-white min-h-screen px-4 sm:px-6 py-6">
            <Toaster position="top-center" reverseOrder={true} />
            <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12 p-4 sm:p-6">
                {/* ---------------- PAYMENT SECTION ---------------- */}
                <div className="w-full lg:w-2/3 flex flex-col items-center justify-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="
        backdrop-blur-xl
        bg-gradient-to-br from-white/90 to-gray-100
        p-6 sm:p-8 md:p-10
        rounded-3xl
        border border-gray-200
        w-full max-w-lg sm:max-w-2xl md:max-w-3xl
        relative overflow-hidden
        shadow-[0_10px_40px_rgba(0,0,0,0.15)]
      "
                        id="payment-container"
                    >

                        {/* Heading */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-4">
                            {productName} — Payment
                        </h1>

                        <p className="text-center text-gray-600 mb-8 text-sm sm:text-lg">
                            Choose your preferred plan
                        </p>


                        {/* ---------------- LOADER ---------------- */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="flex space-x-2">
                                    <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></span>
                                    <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-300"></span>
                                </div>
                                <p className="text-center text-gray-700 mt-4 text-sm sm:text-lg">
                                    Please wait while price info gathers...
                                </p>
                            </div>
                        ) : pricingData ? (
                            <>
                                {/* ---------------- PLAN TIERS ---------------- */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    {(["basic", "premium", "enterprise"] as const).map((tier) => (
                                        <motion.button
                                            key={tier}
                                            onClick={() => setSelectedTier(tier)}
                                            whileHover={{ scale: 1.05 }}
                                            className={`p-4 text-sm sm:text-base rounded-xl font-semibold transition-all duration-300 shadow-md
                  ${selectedTier === tier
                                                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-105 shadow-lg"
                                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                }`}
                                        >
                                            <span className={`${selectedTier === tier ? "text-white" : "text-black"}`}>
                                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                            </span>

                                            {/* Features */}
                                            <ul
                                                className={`mt-3 text-xs sm:text-sm space-y-1 ${selectedTier === tier ? "text-gray-200" : "text-gray-600"
                                                    }`}
                                            >
                                                {tier === "basic" && (
                                                    <>
                                                        <li>✔ Essential Tools</li>
                                                        <li>✔ Limited Support</li>
                                                        <li>✔ Monthly Analytics</li>
                                                    </>
                                                )}
                                                {tier === "premium" && (
                                                    <>
                                                        <li>✔ Everything in Basic</li>
                                                        <li>✔ Priority Support</li>
                                                        <li>✔ Advanced Analytics</li>
                                                        <li>✔ AI-powered Insights</li>
                                                    </>
                                                )}
                                                {tier === "enterprise" && (
                                                    <>
                                                        <li>✔ All Premium Features</li>
                                                        <li>✔ 24×7 Dedicated Support</li>
                                                        <li>✔ Unlimited Users</li>
                                                        <li>✔ Custom Integrations</li>
                                                        <li>✔ SLA Guarantee</li>
                                                    </>
                                                )}
                                            </ul>
                                        </motion.button>
                                    ))}
                                </div>


                                {/* ---------------- MONTHLY / YEARLY ---------------- */}
                                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
                                    {(["monthly", "yearly"] as const).map((plan) => (
                                        <motion.button
                                            key={plan}
                                            onClick={() => setSelectedPlan(plan)}
                                            whileHover={{ scale: 1.05 }}
                                            className={`px-5 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-semibold shadow-md transition-all
                  ${selectedPlan === plan
                                                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105 shadow-lg"
                                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                }`}
                                        >
                                            {plan.charAt(0).toUpperCase() + plan.slice(1)}
                                        </motion.button>
                                    ))}
                                </div>


                                {/* ---------------- PRICE BOX ---------------- */}
                                <motion.div
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="
              bg-gray-50 border border-gray-200 backdrop-blur-md
              p-6 rounded-2xl mb-10 shadow-md
            "
                                >
                                    <h2 className="text-center text-2xl font-bold text-gray-900">
                                        Final Price
                                    </h2>

                                    {(() => {
                                        const UsercurrentType = existingSubscriptionDetail?.subscriptionType;
                                        const UsercurrentPlan = existingSubscriptionDetail?.subscriptionPlan;

                                        const tierOrder = ["basic", "premium", "enterprise"];
                                        const selectedTierIndex = tierOrder.indexOf(selectedTier);
                                        const UsercurrentTierIndex = tierOrder.indexOf(UsercurrentType || "");

                                        const planOrder = ["monthly", "yearly"];
                                        const selectPlanIndex = planOrder.indexOf(selectedPlan);
                                        const UsercurrentPlanIndex = planOrder.indexOf(UsercurrentPlan || "")

                                        const isSameTier = selectedTier === UsercurrentType;
                                        const isSamePlan = selectedPlan === UsercurrentPlan;
                                        const isLowerTier = selectedTierIndex < UsercurrentTierIndex;
                                        const isLowerPlan = (selectedTier === UsercurrentType) && (selectPlanIndex < UsercurrentPlanIndex)

                                        const isSubscribed = existingSubscriptionDetail?.isActive &&
                                            ((isSameTier && isSamePlan) || isLowerTier || isLowerPlan);
                                        console.log(isSameTier)
                                        console.log(isSamePlan)
                                        console.log(isLowerTier)

                                        if (isSubscribed) {
                                            return (
                                                <>
                                                    <p className="text-center text-3xl sm:text-4xl font-extrabold text-green-600 mt-2">
                                                        Subscribed
                                                    </p>
                                                    <p className="text-center text-gray-500 mt-1 text-sm">
                                                        {selectedTier} • {selectedPlan}
                                                    </p>
                                                </>
                                            );
                                        }

                                        return (
                                            <>
                                                <p className="text-center text-4xl sm:text-5xl font-extrabold text-purple-600 mt-2">
                                                    ₹{getFinalPrice()}
                                                </p>
                                                <p className="text-center text-gray-500 mt-1 text-sm">
                                                    {selectedTier} • {selectedPlan}
                                                </p>
                                            </>
                                        );
                                    })()}
                                </motion.div>


                                {/* ---------------- PAY BUTTON ---------------- */}
                                <div className="flex items-center justify-center">
                                    {(() => {
                                        const UsercurrentType = existingSubscriptionDetail?.subscriptionType;
                                        const UsercurrentPlan = existingSubscriptionDetail?.subscriptionPlan;

                                        const tierOrder = ["basic", "premium", "enterprise"];
                                        const selectedTierIndex = tierOrder.indexOf(selectedTier);
                                        const UsercurrentTierIndex = tierOrder.indexOf(UsercurrentType || "");

                                        const isSameTier = selectedTier === UsercurrentType;
                                        const isSamePlan = selectedPlan === UsercurrentPlan;
                                        const isLowerTier = selectedTierIndex < UsercurrentTierIndex;

                                        const planOrder = ["monthly", "yearly"];
                                        const selectPlanIndex = planOrder.indexOf(selectedPlan);
                                        const UsercurrentPlanIndex = planOrder.indexOf(UsercurrentPlan || "")
                                        const isLowerPlan = (selectedTier === UsercurrentType) && (selectPlanIndex < UsercurrentPlanIndex)

                                        const isSubscribed =
                                            existingSubscriptionDetail?.isActive &&
                                            ((isSameTier && isSamePlan) || isLowerTier || isLowerPlan);

                                        return (
                                            <motion.button
                                                whileHover={!isSubscribed ? { scale: 1.12 } : {}}
                                                whileTap={!isSubscribed ? { scale: 0.9 } : {}}
                                                onClick={() => !isSubscribed && handlePaySubmit()}
                                                disabled={isSubscribed}
                                                className={`
                    relative px-10 sm:px-12 py-3 sm:py-4 text-lg font-semibold text-white rounded-2xl
                    transition-all shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                    ${isSubscribed
                                                        ? "cursor-not-allowed"
                                                        : "cursor-pointer"
                                                    }
                  `}
                                            >
                                                {isSubscribed ? "Subscribed" : "Proceed to Pay"}
                                            </motion.button>
                                        );
                                    })()}
                                </div>

                                {/* ---------------- EXTRA PAYMENT INFO ---------------- */}
                                <div className="mt-8 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        🔒 Secure SSL Encrypted Payment
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700">Visa</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700">Mastercard</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700">UPI</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700">NetBanking</span>
                                    </div>
                                </div>

                            </>
                        ) : (
                            <p className="text-center text-red-500 font-semibold">
                                Product not found
                            </p>
                        )}
                    </motion.div>

                </div>

                {/* Alerting Banner and User Subscription Details */}
                <div className="flex flex-col items-center justify-center gap-2">
                    {/* Alert Banner  */}
                    {existingSubscriptionDetail?.isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="mb-2 px-6 py-4 rounded-xl shadow-md bg-gradient-to-r from-yellow-100 via-orange-50 to-lime-100 border-l-4 border-yellow-400 relative overflow-hidden"
                        >
                            {/* Glow accent */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300 via-lime-300 to-transparent opacity-20 blur-2xl animate-pulse" />

                            {/* Icon + Message */}
                            <div className="relative z-10 flex items-center gap-4 text-gray-800">
                                {existingSubscriptionDetail.subscriptionType === "basic" && (
                                    <>
                                        <FaArrowUp className="w-6 h-6 text-yellow-600 animate-bounce" />
                                        <p className="text-sm font-medium">
                                            You're currently on the <span className="font-bold text-yellow-700">Basic</span> plan. Unlock more features by upgrading to <span className="text-green-700 font-semibold">Premium</span> or <span className="text-green-700 font-semibold">Enterprise</span>.
                                        </p>
                                    </>
                                )}
                                {existingSubscriptionDetail.subscriptionType === "premium" && (
                                    <>
                                        <FaRocket className="w-6 h-6 text-orange-600 animate-bounce" />
                                        <p className="text-sm font-medium">
                                            You're on the <span className="font-bold text-orange-700">Premium</span> plan. Consider upgrading to <span className="text-green-700 font-semibold">Enterprise</span> for top-tier benefits.
                                        </p>
                                    </>
                                )}
                                {existingSubscriptionDetail.subscriptionType === "enterprise" && (
                                    <>
                                        <FaCrown className="w-6 h-6 text-green-600 animate-pulse" />
                                        <p className="text-sm font-medium">
                                            👑 You're on the <span className="font-bold text-green-700">Enterprise</span> plan — the highest tier available. Enjoy all premium features!
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}


                    {/* User Existing Subscription Details Container */}
                    {existingSubscriptionDetail?.isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative p-6 mt-6 mb-6 rounded-2xl shadow-xl bg-gradient-to-r from-green-100 via-emerald-50 to-lime-100 border border-green-200 overflow-hidden"
                        >
                            {/* Glow accent */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-300 via-lime-300 to-transparent opacity-30 blur-2xl animate-pulse" />

                            {/* Content */}
                            <div className="relative z-10 space-y-4 text-gray-800">
                                {/* Heading */}
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-lime-600 animate-gradient-x">
                                    🌱 Hello {user?.fullName}
                                </h2>
                                <p className="text-sm text-gray-700">
                                    You already have a subscription to this product with the following details:
                                </p>

                                {/* Subscription Type */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/70 backdrop-blur-md shadow-md hover:scale-105 transition"
                                >
                                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                                    <span className="font-semibold text-green-700">Type:</span>
                                    <span>{existingSubscriptionDetail.subscriptionType}</span>
                                </motion.div>

                                {/* Subscription Plan */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/70 backdrop-blur-md shadow-md hover:scale-105 transition"
                                >
                                    <FaCreditCard className="w-6 h-6 text-lime-600" />
                                    <span className="font-semibold text-lime-700">Plan:</span>
                                    <span>{existingSubscriptionDetail.subscriptionPlan}</span>
                                </motion.div>

                                {/* Start Date */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/70 backdrop-blur-md shadow-md hover:scale-105 transition"
                                >
                                    <FaCalendarAlt className="w-6 h-6 text-emerald-600" />
                                    <span className="font-semibold text-emerald-700">Start Date:</span>
                                    <span>
                                        {new Date(existingSubscriptionDetail.startDate).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </motion.div>

                                {/* End Date */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/70 backdrop-blur-md shadow-md hover:scale-105 transition"
                                >
                                    <FaCalendarAlt className="w-6 h-6 text-green-700" />
                                    <span className="font-semibold text-green-700">End Date:</span>
                                    <span>
                                        {new Date(existingSubscriptionDetail.endDate).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </motion.div>

                                {/* Days Left */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/70 backdrop-blur-md shadow-md hover:scale-105 transition"
                                >
                                    <FaHourglassHalf className="w-6 h-6 text-lime-700" />
                                    <span className="font-semibold text-lime-700">Days Left:</span>
                                    <span>
                                        {Math.max(
                                            0,
                                            Math.ceil(
                                                (new Date(existingSubscriptionDetail.endDate).getTime() -
                                                    new Date().getTime()) /
                                                (1000 * 60 * 60 * 24)
                                            )
                                        )}{" "}
                                        days
                                    </span>
                                </motion.div>

                                {/* Extra Components */}
                                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                    {/* Status Badge */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold shadow-lg animate-bounce"
                                    >
                                        <div className="text-center">Active</div> <div className="text-center">Subscription</div>
                                    </motion.div>

                                    {/* Renewal Reminder */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.4 }}
                                        className="flex-1 p-4 rounded-xl bg-white/80 backdrop-blur-md shadow-md hover:shadow-lg transition"
                                    >
                                        <p className="text-sm text-gray-700">
                                            🔔 Your subscription renews automatically. Don’t forget to check your plan benefits!
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Scroll Down Button */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6 }}
                                    onClick={() => {
                                        const paymentContainer = document.getElementById("payment-container");
                                        if (paymentContainer) {
                                            paymentContainer.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }
                                    }}
                                    className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-lime-600 text-white font-semibold shadow-lg hover:scale-105 transition"
                                >
                                    <FaArrowDown className="w-5 h-5 animate-bounce" />
                                    <span>Go to Payment Section</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Plan Alert Banner */}
                    {existingSubscriptionDetail?.isActive && (
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mb-4 px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 border-l-4 border-blue-400 relative overflow-hidden"
                        >
                            {/* Glow accent */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 via-purple-300 to-transparent opacity-25 blur-2xl animate-pulse" />

                            {/* Icon + Message */}
                            <div className="relative z-10 flex items-center gap-4 text-gray-800">
                                {existingSubscriptionDetail.subscriptionPlan === "monthly" && (
                                    <>
                                        <FaCalendarAlt className="w-6 h-6 text-blue-600 animate-spin" />
                                        <p className="text-sm font-medium">
                                            You're currently on a <span className="font-bold text-blue-700">Monthly</span> plan.
                                            Upgrade to <span className="text-purple-700 font-semibold">Yearly</span> and save more with exclusive benefits!
                                        </p>
                                    </>
                                )}
                                {existingSubscriptionDetail.subscriptionPlan === "yearly" && (
                                    <>
                                        <FaSmileBeam className="w-6 h-6 text-purple-600 animate-bounce" />
                                        <p className="text-sm font-medium">
                                            🎉 Congratulations! You're on a <span className="font-bold text-purple-700">Yearly</span> plan — enjoy uninterrupted access and maximum savings!
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>

            {/* Disclaimer */}
            <div className="flex items-center justify-center mt-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center px-4"
                >
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        🚨 <span className="text-red-500 font-semibold">Important:</span> Once the payment is completed,
                        the amount <span className="text-red-400 font-semibold">cannot be refunded</span>. Please review your selection carefully before proceeding.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default PaymentsPage
