import { Server, Socket } from "socket.io"
import { Conversation, Message, PrismaClient } from "@prisma/client"
import { validateUser } from "../Admin"
import { ApiError } from "../../Utils/ApiError/ApiError"
import expressAsyncHandler from "express-async-handler"
import { RequestWithUser } from "../../Middlewares/JWTGuard"
import { NextFunction, Response } from "express"

const prisma = new PrismaClient()

const getConverstion = async (userA: number, userB: number): Promise<Conversation | null> => {
     return await prisma.conversation.findFirst({ where: { OR: [{ userIdA: userA, userIdB: userB }, { userIdA: userB, userIdB: userA }] } })

}
const createMessage = async (userId: number, content: string, convId: number,socket:Socket,room:string):Promise<void> => {
    try {
        let message = await prisma.message.create({
            data: {
                conversation: { connect: { id: convId } },
                user: { connect: { id: userId } },
                content: content,
            }
        })
        socket.to(room).emit('recived_message', message)
    } catch (error:any) {
        throw new ApiError(error.message,500)
    }
    
}

export const ChatIO = (io: Server, socket: Socket): void => {
    
    socket.on("join room", (body: { room: string }) => {
        socket.join(body.room)
        console.log('User Joined To Room ' + body.room)
        const room = io.sockets.adapter.rooms.get(body.room);
        if (room) {
          const clients = [...room];
          console.log(`Clients in room ${body.room}:`, clients);
        } else {
          console.log(`Room ${body.room} does not exist`);
        }
    })

    socket.on("new_message", async (body: { room: string, message: string, from: number, to: number }) => { 
        
        console.log(`Received message in room ${body.room}: ${body.message}`);

        const existsConverstion : Conversation | null = await getConverstion(body.from, body.to)
        if (existsConverstion) await createMessage(body.from,body.message,existsConverstion.id,socket,body.room)
        else  {
            await prisma.conversation.create({
                data:
                {
                    userA: { connect: { id: body.from } },
                    userB: { connect: { id: body.to } }
                }
            })
                .then(async(conversation) => await createMessage(body.from,body.message,conversation.id,socket,body.room))
                .catch(e => {
                    throw new ApiError(e.message,500)
                })
        }
    })

    socket.on("disconnect", (reason) => {
        console.log("User Disconnected =>" + reason )
        socket.disconnect()
    })

}

export const getConverstions = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = Number(req.user?.id)
    await prisma.conversation.findMany({
        where: { OR: [{ userIdA: id }, { userIdB: id }] },
        include: { messages: true, userA: true, userB: true }
    })
        .then((conversations) => res.json({ conversations }))
})

export const getUsersConverstion = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => { 
        const id = Number(req.user?.id)
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: Number(req.params.id),
            OR: [
                { userIdA: id },
                { userIdB: id }
            ]
        },
        include: { messages: true, userA: true, userB: true }
    })
        if (!conversation) throw new ApiError("Conversation not found", 404)
        res.json({conversation})
})