import { Application } from "express"
import AuthRoutes from "./Auth"
import AdminRoutes from "./Admin"
import PostRoutes from "./Post"
import ChatRoutes from "./Chat"
import { JWTGuard } from "../Middlewares/JWTGuard"
 const MainRoutes = (app:Application)=>{
     app.use("/api/auth", AuthRoutes)
     app.use("/api/admin", AdminRoutes)
     app.use("/api/post",JWTGuard("User"),PostRoutes)
     app.use("/api/chat",JWTGuard("User","Admin"),ChatRoutes)
}

export default MainRoutes