import express,{Express, Request, Response}  from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import MainRoutes from "./Routes/index"
import helmet from "helmet"
import ErrorHandler from "./Middlewares/Error"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

config();
const app: Express = express();
const port: string | undefined = process.env.PORT; 
app.use(cors())
app.use(express.json());
app.use(helmet())

MainRoutes(app)

app.get('/', (req:Request, res:Response) => {
  res.send('Express + TypeScript Server');
});

app.use(ErrorHandler)

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Rest Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "Omar",
        url: "",
      },
      contact: {
        name: "Omar",
        url: "https://portoflio-8erjd6yv1-omarmmohhammedd.vercel.app/",
        email: "omar.mmohhammedd@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["src/Routes/Post/index.js","src/Routes/Auth/index.js","src/Routes/Admin/index.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs,{explorer:true})
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});