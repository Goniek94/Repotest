// dashboardRoutes.js
import express from 'express';
import { getDashboardStats, getMonthlyStats } from '../controllers/dashboardController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleMiddleware.js';

const router = express.Router();

// Middleware sprawdzające rolę admina
const adminCheck = [auth, roleCheck(['admin'])];

// Trasy dla dashboardu
router.get('/stats', adminCheck, getDashboardStats);
router.get('/monthly-stats', adminCheck, getMonthlyStats);

export default router;