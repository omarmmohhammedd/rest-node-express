"use strict";
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints for managing posts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../Controllers/Post");
const Post_2 = require("../../Utils/Validators/Post");
const route = express_1.default.Router();
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
route.post('/', Post_2.AddPostValidator, Post_1.addPost);
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
route.get('/', Post_1.GetPosts);
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
route.get('/:id', Post_1.GetPost);
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
route.patch('/:id', Post_2.UpdatePostValidator, Post_1.UpdatePost);
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
route.delete('/:id', Post_1.DeletePost);
exports.default = route;
