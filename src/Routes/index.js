"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = __importDefault(require("./Auth"));
const Admin_1 = __importDefault(require("./Admin"));
const Post_1 = __importDefault(require("./Post"));
const JWTGuard_1 = require("../Middlewares/JWTGuard");
const MainRoutes = (app) => {
    app.use("/api/auth", Auth_1.default);
    app.use("/api/admin", Admin_1.default);
    app.use("/api/post", (0, JWTGuard_1.JWTGuard)("User"), Post_1.default);
};
exports.default = MainRoutes;
