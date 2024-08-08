import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../services/error/CustomErrorHandler";
import JwtService from "../services/jwt/JwtService";
import { MiddlewareInterface } from "../interfaces";

export const isAuthenticated = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  let authHeader = req.headers.authorization;
  console.log(authHeader , "AuthHeaders")

  if (authHeader === "bearer null" || authHeader === "bearer undefined")
    return next(CustomErrorHandler.unAuthorized());

  try {
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) return next(CustomErrorHandler.unAuthorized());

    const { id, role }: any = await JwtService.verify(jwtToken);
    const user = {
      id,
      role,
    };
    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    return next(CustomErrorHandler.unAuthorized());
  }
};

export const isAdmin = async (
  req: MiddlewareInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req?.user?.role;
    if (role == "ADMIN" || role == "SUPERADMIN") {
      next();
    } else {
      return next(CustomErrorHandler.unAuthorized());
    }
  } catch (error) {
    // console.log(error);
    return next(CustomErrorHandler.unAuthorized());
  }
};
