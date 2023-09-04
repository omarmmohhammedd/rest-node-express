import {check} from "express-validator"
import validator from "../../../Middlewares/Validator"

export const UpdateUserValidator = [
    check("username").notEmpty().isLength({ min: 3, max: 40 }).withMessage("Please Add Valid Username with min 3 characters"),
    validator
]