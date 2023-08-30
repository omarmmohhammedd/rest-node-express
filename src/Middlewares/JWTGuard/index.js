"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTGuard = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const ApiError_1 = require("../../Utils/ApiError/ApiError");
const JWTGuard = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split(" ")[1];
        if (!token)
            return next(new ApiError_1.ApiError("Please Provide Valid Token", 401));
        if (process.env.TOKEN) {
            (0, jsonwebtoken_1.verify)(token, process.env.TOKEN, { complete: true }, (err, decoded) => {
                if (err)
                    return next(new ApiError_1.ApiError(err.message, 401));
                if (!decoded)
                    return next(new ApiError_1.ApiError("Invalid Token", 401));
                const { id, role } = decoded.payload;
                if (allowedRoles.length) {
                    if (!allowedRoles.includes(role))
                        return next(new ApiError_1.ApiError(`Only ${allowedRoles.join("-")} Has Access To This Api`, 401));
                }
                req.user = {
                    id, role
                };
                next();
            });
        }
        else
            next(new ApiError_1.ApiError("Token is required", 500));
    };
};
exports.JWTGuard = JWTGuard;
