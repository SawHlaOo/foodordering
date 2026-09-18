import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/order.js';

const router = Router();
router.post('/', authenticate, authorize('CUSTOMER'), validate(createOrderSchema), orderController.create);
router.get('/', authenticate, authorize('CUSTOMER'), orderController.list);
router.get('/:id', authenticate, authorize('CUSTOMER', 'CHEF', 'ADMIN'), orderController.detail);
router.patch('/:id/cancel', authenticate, authorize('CUSTOMER'), orderController.cancel);
router.post('/:id/dismiss', authenticate, authorize('CUSTOMER'), orderController.dismissCompleted);

export default router;
