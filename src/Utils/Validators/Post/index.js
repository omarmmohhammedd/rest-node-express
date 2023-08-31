"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostValidator = exports.AddPostValidator = void 0;
const express_validator_1 = require("express-validator");
const Validator_1 = __importDefault(require("../../../Middlewares/Validator"));
exports.AddPostValidator = [
    (0, express_validator_1.check)("title").notEmpty().isLength({ min: 3 }).withMessage("Please Add Valid Title To Post "),
    (0, express_validator_1.check)("description").notEmpty().isLength({ min: 10 }).withMessage("Please Add Valid Description To Post With Min 10 characters"),
    Validator_1.default
];
exports.UpdatePostValidator = [
    (0, express_validator_1.check)("title").optional().notEmpty().isLength({ min: 3 }).withMessage("Please Add Valid Title To Post "),
    (0, express_validator_1.check)("description").optional().notEmpty().isLength({ min: 10 }).withMessage("Please Add Valid Description To Post With Min 10 characters"),
    Validator_1.default
];
