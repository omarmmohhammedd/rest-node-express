"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../Controllers/Post");
const Post_2 = require("../../Utils/Validators/Post");
const route = express_1.default.Router();
route.post('/', Post_2.AddPostValidator, Post_1.addPost);
route.get('/', Post_1.GetPosts);
route.get('/:id', Post_1.GetPost);
route.patch('/:id', Post_1.UpdatePost);
route.delete('/:id', Post_1.DeletePost);
exports.default = route;
