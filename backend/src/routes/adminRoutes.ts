import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();
router.get('/dashboard', authenticate, authorize('ADMIN'), adminController.dashboard);
router.get('/orders', authenticate, authorize('ADMIN'), adminController.listOrders);
router.get('/completed-orders', authenticate, authorize('ADMIN'), adminController.listCompletedOrders);
router.delete('/completed-orders/:id', authenticate, authorize('ADMIN'), adminController.deleteCompletedOrder);
router.get('/users', authenticate, authorize('ADMIN'), adminController.listUsers);
router.get('/chefs', authenticate, authorize('ADMIN'), adminController.listChefs);
router.get('/reports', authenticate, authorize('ADMIN'), adminController.getReports);

export default router;
