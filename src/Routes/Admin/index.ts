import express, { Router } from "express"
import {  DeleteUser, GetUser, GetUsers, UpdateUser } from "../../Controllers/Admin"
import { JWTGuard } from "../../Middlewares/JWTGuard"
import { ROLES } from "@prisma/client"
import { UpdateUserValidator } from "../../Utils/Validators/Admin"

const route: Router = express.Router()

route.get('/user', JWTGuard(ROLES.Admin),GetUsers)

route.get('/user/:id',GetUser)

route.patch('/user/:id',UpdateUserValidator,UpdateUser)

route.delete('/user/:id',DeleteUser)

export default route