import { Server } from "socket.io"
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-streams-adapter";



const io = async () : Promise<Server> => {
    // Create Redis Client
    const redisClient = createClient({ url: "rediss://red-cjp6ahj6fquc73f2a4bg:ULt5zL1c8yH1AYs85S9kiz3vd1qyu1bd@oregon-redis.render.com:6379" });
    // Redis Client Connection
    await redisClient.connect()
    // Add Redis Stream Adapter And Run Server
    const server : Server= new Server(5000,{
        adapter: createAdapter(redisClient)
    })
    return server 
}

export default io