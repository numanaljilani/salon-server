"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getservices = exports.createservice = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createservice = async (req, res, next) => {
    const { serviceName, duration, price, description, salonId, } = req.body;
    try {
        const service = await prisma.service.create({
            data: {
                salon: { connect: { id: salonId } },
                duration,
                name: serviceName,
                price,
                description,
            },
        });
        res.status(201).json({ success: true, data: service });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Unable to create Service", details: error.message });
    }
};
exports.createservice = createservice;
const getservices = async (req, res, next) => {
    const { salonId, } = req.body;
    try {
        const services = await prisma.service.findMany({
            where: {
                salonId,
            },
        });
        res.status(201).json({ success: true, data: services });
    }
    catch (error) {
        res.status(400).json({ error: "services error", details: error.message });
    }
};
exports.getservices = getservices;
