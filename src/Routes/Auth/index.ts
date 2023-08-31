/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for authentication
 */


import express, { Router } from "express"
import { Login, Register } from "../../Controllers/Auth"
import { AuthValidator } from "../../Utils/Validators/Auth"


const route: Router = express.Router()


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: test
 *               password: password
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


route.post('/login', AuthValidator, Login)


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               role: User
 *               username: test
 *               password: password
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal Server Error
 */


route.post('/register',AuthValidator,Register)

export default route