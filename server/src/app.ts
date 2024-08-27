import NodeCache from "node-cache";
export const nodeCache = new NodeCache();
import express from "express";
const app = express();


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")) // to serve static files means images, css, js files
app.use("/uploads", express.static("uploads")) // to serve static files means images, css, js files

//routes import 
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js"
import dashboardRoutes from "./routes/stats.routes.js";

//routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);


app.get("/", (_, res) => {
    res.send("API Working with /api/v1");
  });



export { app };