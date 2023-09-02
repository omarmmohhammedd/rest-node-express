"use strict";
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints for users chats
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Chat_1 = require("../../Controllers/Chat");
const route = express_1.default.Router();
/**
 * @swagger
 * paths:
 *   /chat/:
 *     get:
 *       summary: get all converstions
 *       tags: [Chat]
 *       security:
 *         - bearerAuth :[]
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Converstion'
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 */
route.get('/', Chat_1.getConverstions);
route.get('/:id', Chat_1.getUsersConverstion);
exports.default = route;
