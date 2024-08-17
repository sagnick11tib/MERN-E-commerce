import { Router } from "express";
import { allCoupons, applyDiscount, deleteCoupon, getCoupon, newCoupon, updateCoupon } from "../controllers/payment.controllers.js";
const router = Router();

router.route("/create").post(newCoupon);
router.route("/discount").get(applyDiscount);
router.route("/coupon/new").post();
router.route("/coupon/all").get(allCoupons);
router.route("/coupon/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

export default router;