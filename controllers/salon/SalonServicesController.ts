import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { MiddlewareInterface } from "../../interfaces";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export const createservice = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const {
    serviceName,
    duration,
    price,
    description,
    salonId,
  }: {
    serviceName: string;
    duration: number;
    price: number;
    description: string;
    salonId: string;
  } = req.body;

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
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create Service", details: error.message });
  }
};

export const getservices = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const {
    salonId,
  }: {
    salonId: string;
  } = req.body;

  try {
    const services = await prisma.service.findMany({
      where: {
        salonId,
      },
    });

    res.status(201).json({ success: true, data: services });
  } catch (error: any) {
    res.status(400).json({ error: "services error", details: error.message });
  }
};
