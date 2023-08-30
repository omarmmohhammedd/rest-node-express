import express, { Router } from "express"
import { Login, Register } from "../../Controllers/Auth"
import { AuthValidator } from "../../Utils/Validators/Auth"


const route: Router = express.Router()

route.post('/login',AuthValidator,Login)
route.post('/register',AuthValidator,Register)

export default route