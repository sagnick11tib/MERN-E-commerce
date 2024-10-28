import { config } from "dotenv";
config()
import connectDB from "./db/index.js";
import { app } from "./app.js" 
import Razorpay from "razorpay";
import { Redis } from "ioredis"



export const razorInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "",
    key_secret: process.env.RAZORPAY_API_SECRET || "",  
});

const PORT = process.env.PORT || 8000;

export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 15653,
    password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
    console.log("\n ✅ Redis connected!");
    return redis;
});


redis.on("error", (error) => {
    console.log("❌ REDIS connection FAILED", error);
   
});

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start the server after successful connections
        app.listen(PORT, () => {
            console.log(`\n ⚙️ Server is running at port : ${PORT}`);
        });

    } catch (error) {
        console.log(`❌ Server initialization failed:`, error);
        process.exit(1);
    }
};


export default startServer;