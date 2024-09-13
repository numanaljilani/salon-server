"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_owner = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const CustomErrorHandler_1 = __importDefault(require("../../services/error/CustomErrorHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const signup = async (req, res, next) => {
    console.log("Inside customer Registration");
    // Validation
    const registerSchema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string()
            .email()
            .required()
            .pattern(new RegExp("^[a-zA-Z0-9.@]+$"))
            .message("Email address not valid"),
        password: joi_1.default.string()
            .min(6)
            .max(20)
            .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
            .required()
            .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 6 characters long",
            "string.max": "Password cannot be longer than 20 characters",
            "any.required": "Password is required",
        }),
        phoneNumber: joi_1.default.string(),
        profilePic: joi_1.default.string(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // return next(error);
        console.log("error", error);
    }
    const user = await prisma.user.findMany();
    console.log(user, "user from data base");
    // check if user is in the database already
    try {
        const exist = await prisma.user.findUnique({
            where: { email: req.body.email },
        });
        if (exist) {
            return next(CustomErrorHandler_1.default.alreadyExist("This email address has already been registered"));
        }
        const { name, email, password, phoneNumber, profilePic, } = req.body;
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // prepare the model
        const user = await prisma.user.create({
            data: {
                name: name,
                phoneNumber,
                email,
                password: hashedPassword,
                role: "CUSTOMER",
            },
        });
        // new User({
        //   firstName,
        //   lastName,
        //   email,
        //   password: hashedPassword,
        //   avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&&color=fff&&background=0066a2&&rounded=true&&font-size=0.44`,
        // }).save();
        // verify token
        // const verifyToken = await new verificationToken({
        //   userId: user._id,
        //   token: crypto.randomBytes(32).toString("hex"),
        // }).save();
        //sending mail
        // const url = `${process.env.FRONTEND_URL}/${user.id}/verify/${verifyToken.token}`;
        // await sendEmail({
        //   data: {
        //     name: user.firstName,
        //     email: user.email,
        //     subject: "KT-Guru Email Verification ",
        //     sub: "verifyEmail",
        //     url: url,
        //   },
        // });
        res
            .status(200)
            .send({ message: "An Email sent to your account please verify", data: user });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
};
const register_owner = async (req, res, next) => {
    console.log("Inside Owner Registration");
    // Validation
    const registerSchema = joi_1.default.object({
        firstName: joi_1.default.string().min(3).max(30).required(),
        lastName: joi_1.default.string(),
        email: joi_1.default.string()
            .email()
            .required()
            .pattern(new RegExp("^[a-zA-Z0-9.@]+$"))
            .message("Email address not valid"),
        password: joi_1.default.string()
            .min(6)
            .max(20)
            .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"))
            .required()
            .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 6 characters long",
            "string.max": "Password cannot be longer than 20 characters",
            "any.required": "Password is required",
        }),
        phoneNumber: joi_1.default.string(),
        profilePic: joi_1.default.string(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // return next(error);
        console.log("error", error);
    }
    // check if user is in the database already
    try {
        const exist = await prisma.user.findUnique({
            where: { email: req.body.email },
        });
        // TODO: If user is customer then update to admin
        if (exist) {
            return next(CustomErrorHandler_1.default.alreadyExist("This email address has already been registered"));
        }
        const { firstName, lastName, email, password, phoneNumber, profilePic, } = req.body;
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        let data = {
            name: `${firstName} ${lastName}`,
            email,
            avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&&color=fff&&background=0066a2&&rounded=true&&font-size=0.44`,
            password: hashedPassword,
            role: client_1.UserRole.ADMIN,
        };
        // prepare the model
        const user = await prisma.user.create({
            data: data,
        });
        // verify token
        // const verifyToken = await new verificationToken({
        //   userId: user._id,
        //   token: crypto.randomBytes(32).toString("hex"),
        // }).save();
        //sending mail
        // const url = `${process.env.FRONTEND_URL}/${user.id}/verify/${verifyToken.token}`;
        // await sendEmail({
        //   data: {
        //     name: user.firstName,
        //     email: user.email,
        //     subject: "KT-Guru Email Verification ",
        //     sub: "verifyEmail",
        //     url: url,
        //   },
        // });
        console.log("User is registered", user);
        res
            .status(200)
            .send({ message: "An Email sent to your account please verify", data: user });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
};
exports.register_owner = register_owner;
exports.default = signup;
