import express from "express";
import {getSpecificProductSubscription} from "../../controller/payment_controller/getSpecifProductSubs.controller.js";

const router = express.Router();


router.post("/", getSpecificProductSubscription)

export default router