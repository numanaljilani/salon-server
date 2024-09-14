"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.updateAppointment = exports.createAppointment = exports.myappointment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const myappointment = async (req, res, next) => {
    try {
        const skip = parseInt(req?.query?.page) || 20;
        const take = parseInt(req?.query?.limit) || 10;
        // const search: any = parseInt(<string>req?.query?.search) || "";
        const appointmentsArray = await prisma.appointment.findMany({
            where: {
                customerId: req.user?.id,
            },
            orderBy: {
                date: "desc",
            },
            take,
            skip,
        });
        res.status(201).json({ success: true, data: appointmentsArray });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Unable to create salon worker", details: error.message });
    }
};
exports.myappointment = myappointment;
// export const createAppointment = async (
//   req: MiddlewareInterface,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { date, time, status, slot, salonId, service, serviceId } = req.body;
//     // TODO Multiple servce booking at a time
//     const appointment = await prisma.appointment.create({
//       data: {
//         date,
//         status,
//         customer: { connect: { id: req.user?.id } },
//         salon: { connect: { id: salonId } },
//         service: { connect: { id: service.id } },
//       },
//     });
//     res.status(201).json({ success: true, data: appointment });
//   } catch (error: any) {
//     res
//       .status(400)
//       .json({ error: "Unable to create Appointment", details: error.message });
//   }
// };
const createAppointment = async (req, res, next) => {
    try {
        const { date, status, salonId, serviceId } = req.body;
        if (!date || !status || !salonId || !serviceId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const appointment = await prisma.appointment.create({
            data: {
                date: new Date(date),
                status: status,
                customer: { connect: { id: req.user?.id } },
                salon: { connect: { id: salonId } },
                service: { connect: { id: serviceId } },
            },
        });
        res.status(201).json({ success: true, data: appointment });
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ error: "Unable to create Appointment", details: error.message });
    }
};
exports.createAppointment = createAppointment;
const updateAppointment = async (req, res, next) => {
    try {
        await prisma.appointment.update({
            where: {
                id: req.body.id,
            },
            data: req.body,
        });
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.body.id },
        });
        res.status(201).json({ success: true, data: appointment });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Unable to create Appointment", details: error.message });
    }
};
exports.updateAppointment = updateAppointment;
const cancelAppointment = async (req, res, next) => {
    try {
        await prisma.appointment.update({
            where: {
                id: req.body.id,
            },
            data: req.body,
        });
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.body.id },
        });
        res.status(201).json({ success: true, data: appointment });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Unable to create Appointment", details: error.message });
    }
};
exports.cancelAppointment = cancelAppointment;
