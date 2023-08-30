import { Response,Request, NextFunction } from "express";
import { ApiError } from "../../Utils/ApiError/ApiError";


export class HttpError extends Error{
    status: string;
    statusCode: number;
    constructor(statusCode: number, status: string, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
      }
 }
const sendErrorForDev = (err:HttpError, res:Response) =>

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });

const sendErrorForProd = (err:HttpError, res:Response) =>
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
const handleJwtInvalidSignature = () =>
    new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
    new ApiError("Expired token, please login again..", 401);

const ErrorHandler = (err:HttpError, req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV !== "production") {
        sendErrorForDev(err, res);
    } else {
        if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
        if (err.name === "TokenExpiredError") err = handleJwtExpired();
        sendErrorForProd(err, res);
    }
};
export default ErrorHandler;
