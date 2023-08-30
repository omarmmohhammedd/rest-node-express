import { NextFunction, Request, Response } from "express";
import { verify, VerifyErrors, VerifyCallback, JwtPayload, Jwt } from "jsonwebtoken";
import { ROLES } from "@prisma/client";
import { ApiError } from "../../Utils/ApiError/ApiError";

interface jwtDecoded {
  id: number,
  role: string,
}

export interface RequestWithUser extends Request {
  user?: jwtDecoded;
}

export const JWTGuard = (...allowedRoles:ROLES[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split(" ")[1];
    if (!token) return next(new ApiError("Please Provide Valid Token", 401));
    if (process.env.TOKEN) {
      verify(token, process.env.TOKEN, { complete: true }, (err, decoded)  => {
        if (err) return next(new ApiError(err.message, 401));
        if (!decoded) return next(new ApiError("Invalid Token", 401));
        const { id, role } = (<any>decoded).payload
        if (allowedRoles.length) {
          if (!allowedRoles.includes(role)) return next(new ApiError(`Only ${allowedRoles.join("-")} Has Access To This Api`, 401))
        }
        req.user = {
          id,role
        }
        next();
      });
    }else next(new ApiError("Token is required",500))
   
  };
};