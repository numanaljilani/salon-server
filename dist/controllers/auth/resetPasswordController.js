"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const resetpassword = async (req, res, next) => {
    // Joi Validation
    const resetPasswordSchema = joi_1.default.object({
        emailOrPhoneNumber: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    });
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // check user is in the database
        const user = await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                password: hashedPassword,
            },
        });
        console.log(user, "User ");
        res.status(200).json({
            data: { message: "success", response: "Password reset successfull." },
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.resetpassword = resetpassword;
