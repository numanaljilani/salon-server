import pkg from 'joi';
const { ValidationError } = pkg;
import CustomErrorHandler from '../services/error/CustomErrorHandler';
import { NextFunction, Request, Response } from 'express';

const errorHandler = (err :any, req :Request, res :Response, next :NextFunction) => {
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
        ...(process.env.DEBUG_MODE === 'true' && { originalError: err.message })
    }

    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
}

export default errorHandler;



