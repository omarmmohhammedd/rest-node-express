import { PrismaClient,User } from "@prisma/client"
import {  Request, Response } from "express"
import expressAsyncHandler  from "express-async-handler"
import { ApiError } from "../../Utils/ApiError/ApiError"
import { RequestWithUser } from "../../Middlewares/JWTGuard"

const prisma = new PrismaClient()


export const validateUser = async (id:number):Promise<User> => {
  const user: User | null = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError("User Not Found", 404)
  return user
}


export const GetUsers = expressAsyncHandler(async (req: RequestWithUser, res: Response): Promise<void> => {
  const { count, page } = req.query;
  let users: User[];
  if (!count || !page) {
    users = await prisma.user.findMany({orderBy:{id:"asc"}});
  } else {
    const take = Number(count);
    const skip = (Number(page) - 1) * take;
    users = await prisma.user.findMany({ take, skip });
  }
  res
    .status(200)
    .json({ users: users.map((user) => delete (<any>user).password && user) });
});



export const  GetUser = expressAsyncHandler(async(req:Request , res:Response) => {
    const { id } = req.params
    const user: User | null = await validateUser(Number(id))
    delete (<any>user).password
    res.json({user})
})


export const  UpdateUser = expressAsyncHandler(async(req:Request , res:Response) => {
  const { username } = req.body
  const id = Number(req.params.id)
  const user: User | null = await validateUser(id)
  await prisma.user.update({ where: { id }, data: { username } })
    .then((user) => delete (<any>user).password &&
      res
        .status(201)
        .json({ user })
    )
})




export const DeleteUser = expressAsyncHandler(async(req:Request , res:Response) => {
  const user: User | null = await validateUser(Number(req.params.id))
  await prisma.user.delete({ where: { id: Number(req.params.id) } })
    .then(() => res.sendStatus(200))
})