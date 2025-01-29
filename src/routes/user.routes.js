import { Router } from "express";
import { generateOtpforRegistration,
         getUser,
         loginUser,
         logoutUser,
         newRefreshToken,
         resetPassword,
         verifyOtpandRegister } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

//register routes
router.route("/register-otp").post(generateOtpforRegistration)
router.route("/verify-otp/:email").post(verifyOtpandRegister)

//login route
router.route("/login").post(loginUser)

//logout route
router.route("/logout").post(verifyJwt, logoutUser)

//generate new refreshToken
router.route("/refresh-token").post(newRefreshToken)

//reset user password
router.route("/reset-password").post(verifyJwt, resetPassword)

//get current user
router.route("/get-user").get(verifyJwt, getUser)


export default router;