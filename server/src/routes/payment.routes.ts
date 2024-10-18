import { Router } from "express";
import { allCoupons, applyDiscount, deleteCoupon, getCoupon, getKey,  newCoupon, updateCoupon, createPaymentIntentStripe, RazorpayPaymentInit, paymentVerification } from "../controllers/payment.controllers.js";
import { adminOnly } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/create").post(adminOnly,RazorpayPaymentInit);
router.route("/paymentVerification").post(paymentVerification)
router.route("/discount").get(applyDiscount);
router.route("/coupon/new").post(adminOnly,newCoupon);
router.route("/coupon/all").get(adminOnly,allCoupons);
router.route("/coupon/:id").get(adminOnly,getCoupon).put(adminOnly,updateCoupon).delete(adminOnly,deleteCoupon);
router.route("/key").get(getKey);

export default router;