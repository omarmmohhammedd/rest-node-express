import { check } from "express-validator"
import validator from "../../../Middlewares/Validator"




export const AddPostValidator = [
    check("title").notEmpty().isLength({ min: 3 }).withMessage("Please Add Valid Title To Post "),
    check("description").notEmpty().isLength({ min: 10 }).withMessage("Please Add Valid Description To Post With Min 10 characters"),
    validator
]

export const UpdatePostValidator = [
    check("title").optional().notEmpty().isLength({ min: 3 }).withMessage("Please Add Valid Title To Post "),
    check("description").optional().notEmpty().isLength({ min: 10 }).withMessage("Please Add Valid Description To Post With Min 10 characters"),
    validator
]