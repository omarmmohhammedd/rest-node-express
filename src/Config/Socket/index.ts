import { Server } from "socket.io"
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { ApiError } from "../../Utils/ApiError/ApiError";

export const redisClient = createClient({ url: "rediss://red-cjp6ahj6fquc73f2a4bg:ULt5zL1c8yH1AYs85S9kiz3vd1qyu1bd@oregon-redis.render.com:6379" });

const io = async () : Promise<Server> => {
    // Create Redis Client
    // Redis Client Connection
    await redisClient.connect().catch(e => {
        throw new ApiError(e?.message,500)
    })
    // Add Redis Stream Adapter And Run Server
    const server : Server= new Server(5000,{
        adapter: createAdapter(redisClient)
    })
    return server 
}

export default io