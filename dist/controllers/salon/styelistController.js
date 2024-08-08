"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removestylist = exports.updatestylist = exports.createstylist = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createstylist = async (req, res, next) => {
    const { name, email, password, phoneNumber, salonId, } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                avatar: `https://ui-avatars.com/api/?name=${name}&&color=fff&&background=0066a2&&rounded=true&&font-size=0.44`,
                role: "SALON_WORKER",
            },
        });
        const salonWorker = await prisma.salonWorker.create({
            data: {
                salon: { connect: { id: salonId } },
                owner: { connect: { id: req.user.id } },
                worker: { connect: { id: user.id } },
            },
        });
        res.status(201).json({ success: true, data: salonWorker });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Unable to create salon worker", details: error.message });
    }
};
exports.createstylist = createstylist;
const updatestylist = async () => { };
exports.updatestylist = updatestylist;
const removestylist = async () => { };
exports.removestylist = removestylist;
