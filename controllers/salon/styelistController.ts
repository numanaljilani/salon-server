import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { MiddlewareInterface } from "../../interfaces";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export const createstylist = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    salonId,
  }: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    salonId: string;
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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
        owner: { connect: { id: req.user!.id } },
        worker: { connect: { id: user.id } },
      },
    });

    res.status(201).json({ success: true, data: salonWorker });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create salon worker", details: error.message });
  }
};

export const salonstylists = async (
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
    // const user = await prisma.user.();

    const salonWorkers = await prisma.salonWorker.findMany({where : {
      salonId 
    }, include : {
      worker : true
    }});

    res.status(201).json({ success: true, data: salonWorkers });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create salon worker", details: error.message });
  }
};

export const servicestylists = async (
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
    // const user = await prisma.user.();

    const salonWorkers = await prisma.salonWorker.findMany({where : {
      salonId 
    }, include : {
      worker : true
    }});

    res.status(201).json({ success: true, data: salonWorkers });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Unable to create salon worker", details: error.message });
  }
};
export const updatestylist = async () => {};
export const removestylist = async () => {};
