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