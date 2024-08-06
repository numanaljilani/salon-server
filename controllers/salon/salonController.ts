import { NextFunction, Response } from "express";
import { MiddlewareInterface } from "../../interfaces";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const prisma = new PrismaClient();
export const createsalon = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    address: Joi.string(),
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
      owner: { connect: { id: req.user!.id } },
    },
  });

  res.status(200).json({ data: { salon }, success: true });
};
export const updatesalon = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const updateSalonSchema = Joi.object({
    name: Joi.string().min(3),
    address: Joi.string(),
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
export const salonvarification = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const salonVerificationSchema = Joi.object({
    status: Joi.boolean(),
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
  } catch (error) {}
};
export const mysalons = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const mySalonsSchema = Joi.object({
    skip: Joi.number(),
    take: Joi.number(),
  });
  const { error } = mySalonsSchema.validate(req.body);
  if (error) {
    // return next(error);
    console.log("error", error);
  }
  const { skip, take } = req.body;
  try {
    const salons = await prisma.salon.findMany({
      where: { ownerId: req.user!.id },
      skip,
      take,
    });

    res.status(200).json({ data: { salons }, success: true });
  } catch (error) {}
};
