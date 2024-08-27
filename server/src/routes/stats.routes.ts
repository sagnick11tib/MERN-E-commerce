import { Router } from 'express';
const router = Router();
import { getDashboardStats, getPieCharts, getBarCharts, getLineCharts } from '../controllers/stats.controllers.js';

router.route("/stats").get(getDashboardStats);
router.route("/pie").get(getPieCharts);
router.route("/bar").get(getBarCharts);
router.route("/line").get(getLineCharts);






export default router;