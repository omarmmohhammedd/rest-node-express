"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserValidator = void 0;
const express_validator_1 = require("express-validator");
const Validator_1 = __importDefault(require("../../../Middlewares/Validator"));
exports.UpdateUserValidator = [
    (0, express_validator_1.check)("username").notEmpty().isLength({ min: 3, max: 40 }).withMessage("Please Add Valid Username with min 3 characters"),
    Validator_1.default
];
