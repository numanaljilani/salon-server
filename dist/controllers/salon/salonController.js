"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitedSalons = exports.visitSalon = exports.mysalons = exports.salon = exports.salonvarification = exports.updatesalon = exports.createsalon = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});
const handleMultipartData = (0, multer_1.default)({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).array("files", 10); // 5mb
const createsalon = async (req, res, next) => {
    handleMultipartData(req, res, async (err) => {
        if (err) {
            console.log(err, "File upload error");
            return res.status(500).json({ error: "File upload error" });
        }
        const registerSchema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(30).required(),
            address: joi_1.default.string(),
            contact: joi_1.default.number(),
            description: joi_1.default.string(),
        });
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { name, address, contact, description } = req.body;
        const files = req.files;
        // Process the uploaded files
        const fileUrls = files.map((file) => `/uploads/${file.filename}`);
        console.log(fileUrls, "Files urls");
        try {
            const salon = await prisma.salon.create({
                data: {
                    name,
                    address,
                    contact,
                    description,
                    images: {
                        create: fileUrls.map((url) => ({
                            url,
                        })),
                    },
                    owner: { connect: { id: req.user.id } },
                },
            });
            res.status(200).json({ data: { salon }, success: true });
        }
        catch (error) {
            console.log(error, "Error message from the create salon");
            res.status(500).json({ error: "Error creating salon" });
        }
    });
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
const salon = async (req, res, next) => {
    const id = req?.params?.id;
    console.log(id);
    try {
        const salon = await prisma.salon.findUnique({
            where: {
                id,
            },
            include: {
                images: true,
            },
        });
        // console.log(salons)
        res.status(200).json({ data: { salon }, success: true });
    }
    catch (error) { }
};
exports.salon = salon;
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
    console.log("My Salons", req.user.id);
    try {
        const salons = await prisma.salon.findMany({
            where: { ownerId: req.user.id },
        });
        console.log(salons);
        return res.status(200).json({ data: { salons }, success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};
exports.mysalons = mysalons;
const visitSalon = async (req, res, next) => {
    const { salonId } = req.body;
    try {
        const visit = await prisma.visitedSalon.create({
            data: {
                salon: { connect: { id: salonId } },
                user: { connect: { id: req?.user?.id } },
            },
        });
        res.status(200).json({ success: true, data: visit });
    }
    catch (error) {
        console.log(error, "Visit salon");
        res.status(200).json({ success: false, message: error.message });
    }
};
exports.visitSalon = visitSalon;
const visitedSalons = async (req, res, next) => {
    try {
        const visited = await prisma.visitedSalon.findMany({
            where: {
                userId: req.user?.id,
            },
        });
        res.status(200).json({ success: true, data: visited });
    }
    catch (error) {
        console.log(error, "Visit salon");
        res.status(200).json({ success: false, message: error.message });
    }
};
exports.visitedSalons = visitedSalons;
