"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../../Controllers/Admin");
const JWTGuard_1 = require("../../Middlewares/JWTGuard");
const client_1 = require("@prisma/client");
const Admin_2 = require("../../Utils/Validators/Admin");
const route = express_1.default.Router();
route.get('/user', (0, JWTGuard_1.JWTGuard)(client_1.ROLES.Admin), Admin_1.GetUsers);
route.get('/user/:id', Admin_1.GetUser);
route.patch('/user/:id', Admin_2.UpdateUserValidator, Admin_1.UpdateUser);
route.delete('/user/:id', Admin_1.DeleteUser);
exports.default = route;
