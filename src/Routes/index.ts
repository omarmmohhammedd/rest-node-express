/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */
import { Application } from "express"
import AuthRoutes from "./Auth"
import AdminRoutes from "./Admin"
import PostRoutes from "./Post"
import { JWTGuard } from "../Middlewares/JWTGuard"
 const MainRoutes = (app:Application)=>{
     app.use("/api/auth", AuthRoutes)
     app.use("/api/admin", AdminRoutes)
     app.use("/api/post",JWTGuard("User"),PostRoutes)
}

export default MainRoutes