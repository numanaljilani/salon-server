import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from "../../interfaces";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import CustomErrorHandler from "../../services/error/CustomErrorHandler";
import JwtService from "../../services/jwt/JwtService";

const prisma = new PrismaClient();
export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Joi Validation
  const emailPhoneNumberSchema = Joi.object({
    email: Joi.string().required(),
  });
  const { error } = emailPhoneNumberSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { email }: { email: string } = req.body;
  try {
    // check user is in the database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return next(CustomErrorHandler.wrongCredentials());

    // Generate a unique OTP code
    let otpCode;
    let otpExists: any = true;
    while (otpExists) {
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await prisma.otp.findUnique({ where: { code: otpCode } });
    }

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    await prisma.otp.create({
      data: {
        code: otpCode!,
        expiresAt,
        user: { connect: { id: user.id } },
      },
    });

    //TODO send Email to the user {user.email}

    res.status(200).json({
      data: { message: "OTP send successfully." },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Joi Validation
  const OTPSchema = Joi.object({
    otp: Joi.string().required(),
  });
  const { error } = OTPSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { otp }: { otp: string } = req.body;
  try {
    // check user is in the database
    const verifyotp = await prisma.otp.findUnique({
      where: {
        code : otp
      },
      include:{
        user : true
      }
    });

    if (!verifyotp) return next(CustomErrorHandler.notFound("OTP doesnt matched"));


    const otpRecord = await prisma.otp.findFirst({
        where: {
          userId: verifyotp.userId,
          code: otp,
          expiresAt: {
            gt: new Date() // OTP should not be expired
          }
        }
      });

      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }

      // creating access token
      const access_token = JwtService.sign({
        id: verifyotp.user.id,
        role: verifyotp.user.role,
      });

    res.status(200).json({
      data: { access_token },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
