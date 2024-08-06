import express from "express";
import signup, { register_owner } from "../controllers/auth/signupController";
import {  admin_login, login } from "../controllers/auth/loginController";
import { resetpassword } from "../controllers/auth/resetPasswordController";
import { isAuthenticated } from "../middlewares/auth";
import { sendOTP, verifyOTP } from "../controllers/auth/otpController";

const router = express.Router();

// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)


// ---------------------------------------- customers ------------------------------------------//
router.post("/register", signup);

router.post("/login",login)


// ---------------------------------- admin & Super admin ------------------------------------//

router.post("/register-owner",register_owner)
router.post("/admin-login",admin_login)


// enter email and send otp > verify  > resetpassword
router.post("/send-otp",sendOTP)
router.post("/verify-otp",verifyOTP)
router.post("/reset-password",isAuthenticated,resetpassword)




export default router;