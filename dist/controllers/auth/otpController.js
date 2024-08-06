"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const CustomErrorHandler_1 = __importDefault(require("../../services/error/CustomErrorHandler"));
const JwtService_1 = __importDefault(require("../../services/jwt/JwtService"));
const prisma = new client_1.PrismaClient();
const sendOTP = async (req, res, next) => {
    // Joi Validation
    const emailPhoneNumberSchema = joi_1.default.object({
        email: joi_1.default.string().required(),
    });
    const { error } = emailPhoneNumberSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { email } = req.body;
    try {
        // check user is in the database
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user)
            return next(CustomErrorHandler_1.default.wrongCredentials());
        // Generate a unique OTP code
        let otpCode;
        let otpExists = true;
        while (otpExists) {
            otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            otpExists = await prisma.otp.findUnique({ where: { code: otpCode } });
        }
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
        await prisma.otp.create({
            data: {
                code: otpCode,
                expiresAt,
                user: { connect: { id: user.id } },
            },
        });
        //TODO send Email to the user {user.email}
        res.status(200).json({
            data: { message: "OTP send successfully." },
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res, next) => {
    // Joi Validation
    const OTPSchema = joi_1.default.object({
        otp: joi_1.default.string().required(),
    });
    const { error } = OTPSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { otp } = req.body;
    try {
        // check user is in the database
        const verifyotp = await prisma.otp.findUnique({
            where: {
                code: otp
            },
            include: {
                user: true
            }
        });
        if (!verifyotp)
            return next(CustomErrorHandler_1.default.notFound("OTP doesnt matched"));
        const otpRecord = await prisma.otp.findFirst({
            where: {
                userId: verifyotp.userId,
                code: otp,
                expiresAt: {
                    gt: new Date() // OTP should not be expired
                }
            }
        });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        // creating access token
        const access_token = JwtService_1.default.sign({
            id: verifyotp.user.id,
            role: verifyotp.user.role,
        });
        res.status(200).json({
            data: { access_token },
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.verifyOTP = verifyOTP;
