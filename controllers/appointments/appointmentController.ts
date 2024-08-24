import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { MiddlewareInterface } from "../../interfaces";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export const myappointment = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const skip: any = parseInt(<string>req?.query?.page) || 20;
    const take: any = parseInt(<string>req?.query?.limit) || 10;
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
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create salon worker", details: error.message });
  }
};

export const createAppointment = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, time, status, slot, salonId, service, serviceId } = req.body;
    // TODO Multiple servce booking at a time
    const appointment = await prisma.appointment.create({
      data: {
        date,
        status,
        customer: { connect: { id: req.user?.id } },
        salon: { connect: { id: salonId } },
        service: { connect: { id: service.id } },
      },
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create Appointment", details: error.message });
  }
};

export const updateAppointment = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create Appointment", details: error.message });
  }
};
