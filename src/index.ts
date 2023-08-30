import express,{Express, Request, Response}  from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import MainRoutes from "./Routes/index"
import helmet from "helmet"
import ErrorHandler from "./Middlewares/Error"
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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});