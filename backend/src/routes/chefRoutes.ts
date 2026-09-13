import { Router } from 'express';
import { chefController } from '../controllers/chefController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { statusUpdateSchema } from '../validators/order.js';

const router = Router();
router.get('/orders', authenticate, authorize('CHEF'), chefController.list);
router.patch('/orders/:id/status', authenticate, authorize('CHEF'), validate(statusUpdateSchema), chefController.updateStatus);

export default router;
