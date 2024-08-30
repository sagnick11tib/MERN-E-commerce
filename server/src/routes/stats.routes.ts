import { Router } from 'express';
const router = Router();
import { getDashboardStats, getPieCharts, getBarCharts, getLineCharts } from '../controllers/stats.controllers.js';
import { adminOnly } from '../middlewares/auth.middleware.js';

router.route("/stats").get(adminOnly,getDashboardStats);
router.route("/pie").get(adminOnly,getPieCharts);
router.route("/bar").get(adminOnly,getBarCharts);
router.route("/line").get(adminOnly,getLineCharts);






export default router;