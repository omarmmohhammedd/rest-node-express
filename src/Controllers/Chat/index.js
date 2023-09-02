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
exports.getUsersConverstion = exports.getConverstions = exports.ChatIO = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../Utils/ApiError/ApiError");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma = new client_1.PrismaClient();
const getConverstion = (userA, userB) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.conversation.findFirst({ where: { OR: [{ userIdA: userA, userIdB: userB }, { userIdA: userB, userIdB: userA }] } });
});
const createMessage = (userId, content, convId, socket, room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let message = yield prisma.message.create({
            data: {
                conversation: { connect: { id: convId } },
                user: { connect: { id: userId } },
                content: content,
            }
        });
        socket.to(room).emit('recived_message', message);
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.message, 500);
    }
});
const ChatIO = (io, socket) => {
    socket.on("join room", (body) => {
        socket.join(body.room);
        console.log('User Joined To Room ' + body.room);
        const room = io.sockets.adapter.rooms.get(body.room);
        if (room) {
            const clients = [...room];
            console.log(`Clients in room ${body.room}:`, clients);
        }
        else {
            console.log(`Room ${body.room} does not exist`);
        }
    });
    socket.on("new_message", (body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Received message in room ${body.room}: ${body.message}`);
        const existsConverstion = yield getConverstion(body.from, body.to);
        if (existsConverstion)
            yield createMessage(body.from, body.message, existsConverstion.id, socket, body.room);
        else {
            yield prisma.conversation.create({
                data: {
                    userA: { connect: { id: body.from } },
                    userB: { connect: { id: body.to } }
                }
            })
                .then((conversation) => __awaiter(void 0, void 0, void 0, function* () { return yield createMessage(body.from, body.message, conversation.id, socket, body.room); }))
                .catch(e => {
                throw new ApiError_1.ApiError(e.message, 500);
            });
        }
    }));
    socket.on("disconnect", (reason) => {
        console.log("User Disconnected =>" + reason);
        socket.disconnect();
    });
};
exports.ChatIO = ChatIO;
exports.getConverstions = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    yield prisma.conversation.findMany({
        where: { OR: [{ userIdA: id }, { userIdB: id }] },
        include: { messages: true, userA: true, userB: true }
    })
        .then((conversations) => res.json({ conversations }));
}));
exports.getUsersConverstion = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
    const conversation = yield prisma.conversation.findUnique({
        where: { id: Number(req.params.id), OR: [{ userIdA: id }, { userIdB: id }] }, include: { messages: true, userA: true, userB: true }
    });
    if (!conversation)
        throw new ApiError_1.ApiError("Conversation not found", 404);
    res.json({ conversation });
}));
