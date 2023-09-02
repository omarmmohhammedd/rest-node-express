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
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_streams_adapter_1 = require("@socket.io/redis-streams-adapter");
const io = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create Redis Client
    const redisClient = (0, redis_1.createClient)({ url: "rediss://red-cjp6ahj6fquc73f2a4bg:ULt5zL1c8yH1AYs85S9kiz3vd1qyu1bd@oregon-redis.render.com:6379" });
    // Redis Client Connection
    yield redisClient.connect();
    // Add Redis Stream Adapter And Run Server
    const server = new socket_io_1.Server(5000, {
        adapter: (0, redis_streams_adapter_1.createAdapter)(redisClient)
    });
    return server;
});
exports.default = io;
