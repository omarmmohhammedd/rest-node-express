import {check} from "express-validator"
import validator from "../../../Middlewares/Validator"
import { Request } from "express"

export const AuthValidator = [
    check("username").notEmpty().isLength({ min: 3, max: 20 }).withMessage("Please Add Valid Username with min 3 characters"),
    check("password").notEmpty().isLength({ min: 6, max: 40 }).withMessage("Please Add Valid Password with min 6 characters "),
    validator
]