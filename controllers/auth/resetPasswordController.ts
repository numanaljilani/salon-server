import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import CustomErrorHandler from "../../services/error/CustomErrorHandler";
import { PrismaClient } from "@prisma/client";
import { Login, MiddlewareInterface } from "../../interfaces";
import JwtService from "../../services/jwt/JwtService";

const prisma = new PrismaClient();

export const resetpassword = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  // Joi Validation
  const resetPasswordSchema = Joi.object({
    emailOrPhoneNumber: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { password }: { password: string } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // check user is in the database
    const user = await prisma.user.update({
      where: {
        id: req!.user!.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    console.log(user, "User ");

    res.status(200).json({
      data: { message: "success", response: "Password reset successfull." },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
