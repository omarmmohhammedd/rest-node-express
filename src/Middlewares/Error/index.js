"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
const ApiError_1 = require("../../Utils/ApiError/ApiError");
class HttpError extends Error {
    constructor(statusCode, status, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
    }
}
exports.HttpError = HttpError;
const sendErrorForDev = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
});
const sendErrorForProd = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
});
const handleJwtInvalidSignature = () => new ApiError_1.ApiError("Invalid token, please login again..", 401);
const handleJwtExpired = () => new ApiError_1.ApiError("Expired token, please login again..", 401);
const ErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV !== "production") {
        sendErrorForDev(err, res);
    }
    else {
        if (err.name === "JsonWebTokenError")
            err = handleJwtInvalidSignature();
        if (err.name === "TokenExpiredError")
            err = handleJwtExpired();
        sendErrorForProd(err, res);
    }
};
exports.default = ErrorHandler;
