"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const { ValidationError } = joi_1.default;
const CustomErrorHandler_1 = __importDefault(require("../services/error/CustomErrorHandler"));
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
        ...(process.env.DEBUG_MODE === 'true' && { originalError: err.message })
    };
    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        };
    }
    if (err instanceof CustomErrorHandler_1.default) {
        statusCode = err.status;
        data = {
            message: err.message
        };
    }
    return res.status(statusCode).json(data);
};
exports.default = errorHandler;
