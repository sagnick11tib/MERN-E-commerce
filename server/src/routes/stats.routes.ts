import { Router } from 'express';
const router = Router();

router.route("/stats").get();
router.route("/pie").get();
router.route("/bar").get();
router.route("/line").get();






export default router;