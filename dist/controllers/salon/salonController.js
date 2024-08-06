"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysalons = exports.salonvarification = exports.updatesalon = exports.createsalon = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
const createsalon = async (req, res, next) => {
    const registerSchema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        address: joi_1.default.string(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // return next(error);
        console.log("error", error);
    }
    const { name, address, ownerId } = req.body;
    // TODO add description and more details
    const salon = await prisma.salon.create({
        data: {
            name,
            address,
            owner: { connect: { id: req.user.id } },
        },
    });
    res.status(200).json({ data: { salon }, success: true });
};
exports.createsalon = createsalon;
const updatesalon = async (req, res, next) => {
    const updateSalonSchema = joi_1.default.object({
        name: joi_1.default.string().min(3),
        address: joi_1.default.string(),
    });
    const { error } = updateSalonSchema.validate(req.body);
    if (error) {
        // return next(error);
        console.log("error", error);
    }
    const { id } = req.params;
    const salon = await prisma.salon.update({
        where: { id },
        data: req.body,
    });
    res.status(200).json({ data: { salon }, success: true });
};
exports.updatesalon = updatesalon;
const salonvarification = async (req, res, next) => {
    const salonVerificationSchema = joi_1.default.object({
        status: joi_1.default.boolean(),
    });
    const { error } = salonVerificationSchema.validate(req.body);
    if (error) {
        // return next(error);
        console.log("error", error);
    }
    const { id } = req.params;
    const { status } = req.body;
    try {
        const salon = await prisma.salon.update({
            where: { id },
            data: {
                isVerified: status,
            },
        });
        res.status(200).json({ data: { salon }, success: true });
    }
    catch (error) { }
};
exports.salonvarification = salonvarification;
const mysalons = async (req, res, next) => {
    const mySalonsSchema = joi_1.default.object({
        skip: joi_1.default.number(),
        take: joi_1.default.number(),
    });
    const { error } = mySalonsSchema.validate(req.body);
    if (error) {
        // return next(error);
        console.log("error", error);
    }
    const { skip, take } = req.body;
    try {
        const salons = await prisma.salon.findMany({
            where: { ownerId: req.user.id },
            skip,
            take,
        });
        res.status(200).json({ data: { salons }, success: true });
    }
    catch (error) { }
};
exports.mysalons = mysalons;
