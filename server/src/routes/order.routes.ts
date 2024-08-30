import { Router } from "express";
import { adminOnly } from "../middlewares/auth.middleware.js";
import { allOrder, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.controllers.js";
const router = Router();

router.route("/new").post(newOrder);
router.route("/my").get(myOrders);
router.route("/all").get(adminOnly,allOrder);
router.route("/:id").get(getSingleOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder);

export default router;

