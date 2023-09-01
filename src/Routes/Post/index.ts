/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints for managing posts
 */


import express, { Router } from "express"
import { AddComment, DeleteComment, DeletePost, GetPost, GetPosts, Like, UpdatePost, addPost } from "../../Controllers/Post"
import { AddPostValidator, UpdatePostValidator } from "../../Utils/Validators/Post"


const route: Router = express.Router()

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: Test Post
 *               description: This is a test post
 *     responses:
 *       200:
 *         description: OK
 */


route.post('/', AddPostValidator, addPost)

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: OK
 */

route.get('/', GetPosts)

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description:Not Found 
 */


route.get('/:id', GetPost)


/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *      summary: Update a post
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the post to update
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *              example:
 *                title: Test Post Updated
 *                description: This is an updated test post
 *      responses:
 *        200:
 *          description: OK
 *        400 :
 *          description: Bad Request
 */


route.patch('/:id', UpdatePostValidator, UpdatePost)


/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Not Found
 */

route.delete('/:id', DeletePost)



/**
 * @swagger
 * /like/{id}:
 *   patch:
 *      summary: Toggle like on post
 *      tags: [Posts]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the post to update
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: OK
 *        400 :
 *          description: Bad Request
 */


route.patch('/like/:id',Like)


/**
 * @swagger
 * /comment/{id}:
 *   post:
 *      summary: Add comment  on post
 *      tags: [Posts]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Post to Add Comment
 *         schema:
 *           type: integer
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *             example:
 *               body: Test Comment
 *      responses:
 *       200:
 *         description: OK
 */


route.post('/comment/:id', AddComment)


/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Comment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Not Found
 */

route.delete('/comment/:id', DeleteComment)

export default route