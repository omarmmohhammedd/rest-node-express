import {check} from "express-validator"
import validator from "../../../Middlewares/Validator"

export const UpdateUserValidator = [
    check("username").notEmpty().isLength({ min: 3, max: 40 }).withMessage("Username Must Be at least 3 characters "),
    validator
]