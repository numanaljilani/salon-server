"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupController_1 = __importStar(require("../controllers/auth/signupController"));
const loginController_1 = require("../controllers/auth/loginController");
const resetPasswordController_1 = require("../controllers/auth/resetPasswordController");
const auth_1 = require("../middlewares/auth");
const otpController_1 = require("../controllers/auth/otpController");
const router = express_1.default.Router();
// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)
// ---------------------------------------- customers ------------------------------------------//
router.post("/register", signupController_1.default);
router.post("/login", loginController_1.login);
// ---------------------------------- admin & Super admin ------------------------------------//
router.post("/register-owner", signupController_1.register_owner);
router.post("/admin-login", loginController_1.admin_login);
// enter email and send otp > verify  > resetpassword
router.post("/send-otp", otpController_1.sendOTP);
router.post("/verify-otp", otpController_1.verifyOTP);
router.post("/reset-password", auth_1.isAuthenticated, resetPasswordController_1.resetpassword);
exports.default = router;
