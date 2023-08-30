"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.UpdateUser = exports.GetUser = exports.GetUsers = exports.validateUser = void 0;
const client_1 = require("@prisma/client");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ApiError_1 = require("../../Utils/ApiError/ApiError");
const prisma = new client_1.PrismaClient();
const validateUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new ApiError_1.ApiError("User Not Found", 404);
    return user;
});
exports.validateUser = validateUser;
exports.GetUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { count, page } = req.query;
    let users;
    if (!count || !page) {
        users = yield prisma.user.findMany({ orderBy: { id: "asc" } });
    }
    else {
        const take = Number(count);
        const skip = (Number(page) - 1) * take;
        users = yield prisma.user.findMany({ take, skip });
    }
    res
        .status(200)
        .json({ users: users.map((user) => delete user.password && user) });
}));
exports.GetUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield (0, exports.validateUser)(Number(id));
    delete user.password;
    res.json({ user });
}));
exports.UpdateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const id = Number(req.params.id);
    const user = yield (0, exports.validateUser)(id);
    yield prisma.user.update({ where: { id }, data: { username } })
        .then((user) => delete user.password &&
        res
            .status(201)
            .json({ user }));
}));
exports.DeleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.validateUser)(Number(req.params.id));
    yield prisma.user.delete({ where: { id: Number(req.params.id) } })
        .then(() => res.sendStatus(200));
}));
