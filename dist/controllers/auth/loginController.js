"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin_login = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const CustomErrorHandler_1 = __importDefault(require("../../services/error/CustomErrorHandler"));
const client_1 = require("@prisma/client");
const JwtService_1 = __importDefault(require("../../services/jwt/JwtService"));
const prisma = new client_1.PrismaClient();
const login = async (req, res, next) => {
    // Joi Validation
    const loginSchema = joi_1.default.object({
        emailOrPhoneNumber: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        FCMToken: joi_1.default.string(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { emailOrPhoneNumber, password, FCMToken } = req.body;
    try {
        // check user is in the database
        const user = await prisma.user.findMany({
            where: {
                OR: [
                    { email: emailOrPhoneNumber },
                    { phoneNumber: emailOrPhoneNumber },
                ],
            },
            include: {
                profile: true,
            },
        });
        console.log(user, "User ");
        //if not user sending error with message through custom errror handler
        if (!user || user.length < 1) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // compare the password
        const match = (await bcrypt_1.default.compare(password, user[0]?.password)) || "";
        //if not match sending error with message through custom errror handler
        if (!match) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // check user verified or not if not verified then this code execute.
        //   if (!user.verified) {
        // cheaking in verificationToken schema token is present or not we have to send verification token on mail
        // let verifyToken = await verificationToken.findOne({ userId: user._id });
        // if not token we craete new token with user id
        // if (!verifyToken) {
        //   verifyToken = await new verificationToken({
        //     userId: user._id,
        //     token: crypto.randomBytes(32).toString("hex"),
        //   }).save();
        // }
        // preparing URL for verify email with verification token and userId
        // const url = `${process.env.FRONTEND_URL}/${user.id}/verify/${verifyToken.token}`;
        //sending mail this is our mail sending function in
        //this function we send userName,email,subject of mail,Url, and sub
        // sub is key word in our sendMail function we check through sub for sending email templates
        // await sendEmail({
        //   data: {
        //     name: user.firstName,
        //     email: user.email,
        //     subject: "KT-Guru Email Verification",
        //     sub: "verifyEmail",
        //     url: url,
        //   },
        // });
        // return response and sending message
        // return res
        //   .status(400)
        //   .json({ message: "An Email sent to your account please verify" });
        //   }
        //   if (req.body.FCMToken) {
        //     user.FCMToken = req.body.FCMToken;
        //     await user.save();
        //   }
        // cheaking user role is company
        //   const userRoleCompany = await Company.find({
        //     teams: { $elemMatch: { userId: user.id } },
        //   });
        // assign in to roleCompany variable
        //   const roleCompany = userRoleCompany[0];
        // cheaking user role is consultant
        //   const userRoleConsultant = await Consultant.find({ userId: user.id });
        // assign in to roleConsultant variable
        //   const roleConsultant = userRoleConsultant[0];
        // creating access token
        const access_token = JwtService_1.default.sign({
            id: user[0].id,
            role: user[0].role,
        });
        // creating refresh token
        const refresh_token = JwtService_1.default.sign({ id: user[0].id, role: user[0].role }, "1y", process.env.REFRESH_SECRET);
        // saving refresh token to database for authentication if access token is expired we got request for new access token with refresh token.
        // we check the refresh token is valid with stored refresh token
        //   await RefreshToken.create({ token: refresh_token, userId: user.id });
        // if user have any role then sending with "isProfile: true"
        //   if (roleCompany || roleConsultant) {
        //     return res
        //       .status(200)
        //       .json({ access_token, refresh_token, isProfile: true });
        //   }
        // if user don't have any role then sending only with tokens
        res.status(200).json({
            data: { access_token, refresh_token, user: user[0] },
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.login = login;
const admin_login = async (req, res, next) => {
    // Joi Validation
    const loginSchema = joi_1.default.object({
        emailOrPhoneNumber: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    });
    console.log(req.body);
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    console.log("inside login admin routes");
    const { emailOrPhoneNumber, password } = req.body;
    try {
        // check user is in the database
        const user = await prisma.user.findMany({
            where: {
                OR: [
                    { email: emailOrPhoneNumber },
                    { phoneNumber: emailOrPhoneNumber },
                ],
            },
        });
        console.log(user, "User ");
        //if not user sending error with message through custom errror handler
        if (!user || user.length < 1) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // compare the password
        const match = (await bcrypt_1.default.compare(password, user[0]?.password)) || "";
        console.log(match, ">>>>>>>>>");
        //if not match sending error with message through custom errror handler
        if (!match) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        if (user[0]?.role == "ADMIN" || user[0].role == "SUPER_ADMIN") {
            // creating access token
            const access_token = JwtService_1.default.sign({
                id: user[0].id,
                role: user[0].role,
            });
            // creating refresh token
            const refresh_token = JwtService_1.default.sign({ id: user[0].id, role: user[0].role }, "1y", process.env.REFRESH_SECRET);
            res.status(200).json({
                data: { access_token, refresh_token, user: user[0] },
                success: true,
            });
        }
        else {
            return next(CustomErrorHandler_1.default.unAuthorized());
        }
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.admin_login = admin_login;
