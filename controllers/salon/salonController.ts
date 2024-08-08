import { NextFunction, Response } from "express";
import { MiddlewareInterface } from "../../interfaces";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import path from "path";
import multer from "multer";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).array("files", 10); // 5mb

export const createsalon = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  handleMultipartData(req, res, async (err) => {
    if (err) {
      console.log(err, "File upload error");
      return res.status(500).json({ error: "File upload error" });
    }

    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      address: Joi.string(),
      contact: Joi.number(),
      description: Joi.string(),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, address, contact, description } = req.body;
    const files = req.files as Express.Multer.File[];

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
          owner: { connect: { id: req.user!.id } },
        },
      });

      res.status(200).json({ data: { salon }, success: true });
    } catch (error) {
      console.log(error, "Error message from the create salon");
      res.status(500).json({ error: "Error creating salon" });
    }
  });
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
export const salon = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
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
  console.log("My Salons", req.user!.id);
  try {
    const salons = await prisma.salon.findMany({
      where: { ownerId: req.user!.id },
    });
    console.log(salons);
    return res.status(200).json({ data: { salons }, success: true });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const visitSalon = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  const { salonId } = req.body;
  try {
    const visit = await prisma.visitedSalon.create({
      data: {
        salon: { connect: { id: salonId } },
        user: { connect: { id: req?.user?.id } },
      },
    });

    res.status(200).json({ success: true, data: visit });
  } catch (error : any) {
    console.log(error, "Visit salon");
    res.status(200).json({ success: false, message: error.message });
  }
};

export const visitedSalons = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const visited = await prisma.visitedSalon.findMany({
      where: {
        userId : req.user?.id,
      },
    });

    res.status(200).json({ success: true, data: visited });
  } catch (error : any) {
    console.log(error, "Visit salon");
    res.status(200).json({ success: false, message: error.message });
  }
};
