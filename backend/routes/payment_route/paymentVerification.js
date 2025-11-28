import express from "express";
import {paymentVerificationAPI} from "../../controller/payment_controller/paymentVerification.controller.js"
const router = express.Router();

router.post("/", paymentVerificationAPI)
export default router