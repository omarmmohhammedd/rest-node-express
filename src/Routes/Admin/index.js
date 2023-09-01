"use strict";
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for managing  users
 */
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
/**
 * @swagger
 * /admin/user:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
route.get('/user', (0, JWTGuard_1.JWTGuard)(client_1.ROLES.Admin), Admin_1.GetUsers);
/**
 * @swagger
 * /admin/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 */
route.get('/user/:id', Admin_1.GetUser);
/**
 * @swagger
 * /admin/user/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: John Doe
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */
route.patch('/user/:id', Admin_2.UpdateUserValidator, Admin_1.UpdateUser);
/**
 * @swagger
 * /admin/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */
route.delete('/user/:id', Admin_1.DeleteUser);
exports.default = route;
