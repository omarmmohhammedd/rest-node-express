/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for managing  users
 */


import express, { Router } from "express"
import {  DeleteUser, GetUser, GetUsers, UpdateUser } from "../../Controllers/Admin"
import { JWTGuard } from "../../Middlewares/JWTGuard"
import { ROLES } from "@prisma/client"
import { UpdateUserValidator } from "../../Utils/Validators/Admin"

const route: Router = express.Router()



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


route.get('/user', JWTGuard(ROLES.Admin),GetUsers)


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


route.get('/user/:id',GetUser)


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


route.patch('/user/:id',UpdateUserValidator,UpdateUser)


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


route.delete('/user/:id',DeleteUser)

export default route