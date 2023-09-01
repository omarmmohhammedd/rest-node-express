import expressAsyncHandler from "express-async-handler";
import { RequestWithUser } from "../../Middlewares/JWTGuard";
import { NextFunction, Response } from "express";
import { Post, PrismaClient, User } from "@prisma/client";
import { ApiError } from "../../Utils/ApiError/ApiError";

const prisma= new PrismaClient()

export const validatePost = async (id: number) => {
    try {
        const post = await prisma.post.findUnique({ where: { id } ,
            include: { Comments: true }})
        if (!post) throw new ApiError("Post Not Found", 404)
        return post
    } catch (error:any) {
        throw new ApiError(error.message,500)
    }
    
} 

export const addPost = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const {title,description} = req.body
    const id: number = Number(req.user?.id)
    const post : Post= await prisma.post.create({ data: {  description, title,user_id: id } }) 
    res.status(201).json({post})
})

export const GetPosts = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { count, page } = req.query
    if (!count || !page) await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { Comments: true }
    })
        .then((posts) => res.json({ posts }))
    else await prisma.post.findMany(
        {
            orderBy: { createdAt: 'desc' },
            take: Number(count),
            skip: ((Number(page) - 1) * Number(count)),
            include: { Comments: true }
        })
        .then((posts)=>res.json(posts))
})

export const GetPost = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params
    const post = await validatePost(Number(id))
    res.json({post})   
})

export const UpdatePost = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.user?.id
    const post = await validatePost(Number(req.params.id))
    if (post.user_id !== id) next(new ApiError("This Post Is Belong To Another User", 409))
    const { title, description } = req.body
    const updatedPost = await prisma.post.update({
        where: { id: Number(req.params.id) },
        data: {
            title: title && title,
            description: description && description
        }
    })
    res.status(201).json({post:updatedPost})
    
    
})

export const DeletePost = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.user?.id
    const post = await validatePost(Number(req.params.id))
    if (post.user_id !== id) next(new ApiError("This Post Is Belong To Another User", 409))
    await prisma.post.delete({where:{id:Number(req.params.id)}}).then(()=>res.sendStatus(200))
})

export const Like = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    if (id !== undefined) {
        let post = await validatePost(Number(req.params.id));
        if (post.Likes.length) {
            if (post.Likes.includes(id)) {
                const newLikes = post.Likes.filter(like => like !== id);
                post = await prisma.post.update({
                    where: { id: Number(req.params.id) },
                    data: {
                        Likes: newLikes
                    },
                    include:{Comments:true}
                });
            } else {
                const newLikes = [...post.Likes,id];
                post =  await prisma.post.update({
                    where: { id: Number(req.params.id) },
                    data: {
                        Likes: newLikes
                    },
                    include:{Comments:true}
                });
            }
            
        } else {
            post =  await prisma.post.update({
                where: { id: Number(req.params.id) },
                data: {
                    Likes: [id]
                },
                include:{Comments:true}
            });
        }
        res.json(post)
    }
});

export const AddComment = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => { 
    const id = req.user?.id
    const { body } = req.body
    if (id) {
        const comment = await prisma.comment.create({ data: { body, post_id: Number(req.params.id), user_id: id } })
        res.json({comment})
    }
})

export const DeleteComment = expressAsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => { 
    const  id  = req.user?.id
    const comment = await prisma.comment.findUnique({ where: { id: Number(req.params.id) ,user_id:id} })
    if (!comment) return next(new ApiError("Comment not found", 404))
    await prisma.comment.delete({where:{id: Number(req.params.id) ,user_id:id}}).then(()=>res.sendStatus(200))
})