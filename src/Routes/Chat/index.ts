/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints for users chats
 */


import express, { Router } from "express"
import { getConverstions, getUsersConverstion } from "../../Controllers/Chat"


const route: Router = express.Router()


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


route.get('/', getConverstions)

route.get('/:id',getUsersConverstion)

export default route