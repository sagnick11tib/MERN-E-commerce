
import NodeCache from "node-cache";
import cors from "cors";
import morgan from "morgan";
export const nodeCache = new NodeCache( //
   
);
import express from "express";
const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true,limit: "50mb"}))
app.use(express.static("public")) // to serve static files means images, css, js files
app.use("/uploads", express.static("uploads")) // to serve static files means images, css, js files
//app.use(errorHandler);

//routes import 
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js"
import dashboardRoutes from "./routes/stats.routes.js";
import { ApiError } from "./utils/ApiError.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { redis } from "./index.js";


//routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);


app.get("/", (_, res) => {
    res.send("API Working with /api/v1");
  });

  app.post("/api/v1/cache/clear", (req, res) => {
    nodeCache.flushAll();
    return res.json({ message: "Cache Cleared" });
  });

  app.get("/api/v1/test", asyncHandler(async (req, res) => {
     throw new ApiError(404, "Not Found");
  }));

  app.get("/api/v1/redistest", asyncHandler(async (req, res) => { 
    redis.set("test", "test");
    const test = await redis.get("test");
    return res.json({ test });
  }));

export { app };