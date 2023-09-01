"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteComment = exports.AddComment = exports.Like = exports.DeletePost = exports.UpdatePost = exports.GetPost = exports.GetPosts = exports.addPost = exports.validatePost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../Utils/ApiError/ApiError");
const prisma = new client_1.PrismaClient();
const validatePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield prisma.post.findUnique({ where: { id },
            include: { Comments: true } });
        if (!post)
            throw new ApiError_1.ApiError("Post Not Found", 404);
        return post;
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.message, 500);
    }
});
exports.validatePost = validatePost;
exports.addPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description } = req.body;
    const id = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    const post = yield prisma.post.create({ data: { description, title, user_id: id } });
    res.status(201).json({ post });
}));
exports.GetPosts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { count, page } = req.query;
    if (!count || !page)
        yield prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: { Comments: true }
        })
            .then((posts) => res.json({ posts }));
    else
        yield prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            take: Number(count),
            skip: ((Number(page) - 1) * Number(count)),
            include: { Comments: true }
        })
            .then((posts) => res.json(posts));
}));
exports.GetPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield (0, exports.validatePost)(Number(id));
    res.json({ post });
}));
exports.UpdatePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const post = yield (0, exports.validatePost)(Number(req.params.id));
    if (post.user_id !== id)
        next(new ApiError_1.ApiError("This Post Is Belong To Another User", 409));
    const { title, description } = req.body;
    const updatedPost = yield prisma.post.update({
        where: { id: Number(req.params.id) },
        data: {
            title: title && title,
            description: description && description
        }
    });
    res.status(201).json({ post: updatedPost });
}));
exports.DeletePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const post = yield (0, exports.validatePost)(Number(req.params.id));
    if (post.user_id !== id)
        next(new ApiError_1.ApiError("This Post Is Belong To Another User", 409));
    yield prisma.post.delete({ where: { id: Number(req.params.id) } }).then(() => res.sendStatus(200));
}));
exports.Like = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    if (id !== undefined) {
        let post = yield (0, exports.validatePost)(Number(req.params.id));
        if (post.Likes.length) {
            if (post.Likes.includes(id)) {
                const newLikes = post.Likes.filter(like => like !== id);
                post = yield prisma.post.update({
                    where: { id: Number(req.params.id) },
                    data: {
                        Likes: newLikes
                    },
                    include: { Comments: true }
                });
            }
            else {
                const newLikes = [...post.Likes, id];
                post = yield prisma.post.update({
                    where: { id: Number(req.params.id) },
                    data: {
                        Likes: newLikes
                    },
                    include: { Comments: true }
                });
            }
        }
        else {
            post = yield prisma.post.update({
                where: { id: Number(req.params.id) },
                data: {
                    Likes: [id]
                },
                include: { Comments: true }
            });
        }
        res.json(post);
    }
}));
exports.AddComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const id = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
    const { body } = req.body;
    if (id) {
        const comment = yield prisma.comment.create({ data: { body, post_id: Number(req.params.id), user_id: id } });
        res.json({ comment });
    }
}));
exports.DeleteComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const id = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
    const comment = yield prisma.comment.findUnique({ where: { id: Number(req.params.id), user_id: id } });
    if (!comment)
        return next(new ApiError_1.ApiError("Comment not found", 404));
    yield prisma.comment.delete({ where: { id: Number(req.params.id), user_id: id } }).then(() => res.sendStatus(200));
}));
