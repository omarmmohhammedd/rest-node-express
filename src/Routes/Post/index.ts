import express, { Router } from "express"
import { DeletePost, GetPost, GetPosts, UpdatePost, addPost } from "../../Controllers/Post"
import { AddPostValidator, UpdatePostValidator } from "../../Utils/Validators/Post"


const route: Router = express.Router()

route.post('/', AddPostValidator, addPost)
route.get('/', GetPosts)
route.get('/:id', GetPost)
route.patch('/:id', UpdatePostValidator,UpdatePost)
route.delete('/:id',DeletePost)
export default route