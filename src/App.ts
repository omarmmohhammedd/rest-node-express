import express,{Express, Request, Response}  from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import helmet from "helmet"
import morgan from "morgan"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import * as swaggerDocment from "../swagger.json"
import MainRoutes from "./Routes/index"
import ErrorHandler from "./Middlewares/Error"
import IoInit from "./Config/Socket"
import { ChatIO } from './Controllers/Chat'


const app: Express = express();
const port: string | undefined = process.env.PORT; 

// Enable Dotenv Variables
config();
// Enable Cors
app.use(cors())
// Enable Request With Json Fromat
app.use(express.json());
// Enable Hemlet Middleware
app.use(helmet())
// Enable Logging For Apis
process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))

// Base Route
app.get('/', (req:Request, res:Response) => {
  res.send('Express + TypeScript Server');
});

// Routes
MainRoutes(app)
  
// Swagger Setup
const specs = swaggerJsdoc(swaggerDocment);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true ,swaggerOptions:{url:'http://localhost:8080/api-docs/docs'}})
);

// Socket IO Initialization
IoInit().then((io) => {
  io.on("connection", (socket) => ChatIO(io,socket))
})

// Error Handler Middleware
app.use(ErrorHandler)


// Running App
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app
