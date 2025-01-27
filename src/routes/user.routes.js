import { Router } from "express";
import { generateOtpforRegistration, verifyOtpandRegister } from "../controllers/user.controller.js";

const router = Router()

router.route("/register-otp").post(generateOtpforRegistration)
router.route("/verify-otp/:email").post(verifyOtpandRegister)


export default router;