import express from "express";
import {GenerateRazorpayOrderID , RazorPayPaymentVerification} from '../../controller/razorpayController/razorpayController.js';

const router = express.Router();

router.post("/OrderID", GenerateRazorpayOrderID)
router.post("/Verification", RazorPayPaymentVerification) // Its verfiy as well as payment refund API

export default router