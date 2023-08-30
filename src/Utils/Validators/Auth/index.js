"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const express_validator_1 = require("express-validator");
const Validator_1 = __importDefault(require("../../../Middlewares/Validator"));
exports.AuthValidator = [
    (0, express_validator_1.check)("username").notEmpty().isLength({ min: 3, max: 20 }).withMessage("Please Add Valid Username with min 3 characters"),
    (0, express_validator_1.check)("password").notEmpty().isLength({ min: 6, max: 40 }).withMessage("Please Add Valid Password with min 6 characters "),
    Validator_1.default
];
