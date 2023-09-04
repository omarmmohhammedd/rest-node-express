import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiError } from "../../Utils/ApiError/ApiError";
import * as bcrypt from "bcryptjs"
import {sign} from "jsonwebtoken"

const prisma = new PrismaClient()

export const Login = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) : Promise<void>=> {
    const { username, password } = req.body
    const user = await prisma.user.findFirst({ where: { username } })
    if (!user) return next(new ApiError("User Not Found", 404))
    const match = await bcrypt.compare(password, user.password)
    if (!match) return next(new ApiError("Password Not Match", 400))
    if (process.env.TOKEN) {
        const token = sign({ id: user.id, role: user.role }, process.env.TOKEN)
        const {password,...userData} = user
        res.json({user:userData,token})
    }else return next(new ApiError("Token Must Be Required",500))
})

export const Register = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) : Promise<void>=> {
    const { username, password } = req.body
    const exists = await prisma.user.findFirst({ where: { username } })
    if (exists) return next(new ApiError("username exists", 403))
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { username, password: hashedPassword } })
    delete (user as any).password
    res.status(201).json({user})
})

