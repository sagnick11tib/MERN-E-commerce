import { Router } from "express";
const router = Router();

router.route("/create").post();
router.route("/discount").get();
router.route("/coupon/new").post();
router.route("/coupon/all").get();
router.route("/coupon/:id").get().put().delete();