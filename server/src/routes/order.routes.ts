import { Router } from "express";
import { adminOnly } from "../middlewares/auth.middleware.js";
import { allOrder, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.controllers.js";
const router = Router();

router.route("/new").post(newOrder);
router.route("/my").get(myOrders);
router.route("/all").get(allOrder);
router.route("/:id").get(getSingleOrder).put(processOrder).delete(deleteOrder);

export default router;

