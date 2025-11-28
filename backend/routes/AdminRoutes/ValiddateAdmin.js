import express from "express";

import { ValidateAdminAPI } from "../../controller/AdminController/ValidateAdminAPI.controller.js"

const router = express.Router();

router.post("/", ValidateAdminAPI)

export default router