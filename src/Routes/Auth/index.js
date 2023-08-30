"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../../Controllers/Auth");
const Auth_2 = require("../../Utils/Validators/Auth");
const route = express_1.default.Router();
route.post('/login', Auth_2.AuthValidator, Auth_1.Login);
route.post('/register', Auth_2.AuthValidator, Auth_1.Register);
exports.default = route;
