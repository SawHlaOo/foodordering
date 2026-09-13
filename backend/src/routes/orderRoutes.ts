import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/order.js';

const router = Router();
router.post('/', authenticate, authorize('CUSTOMER'), validate(createOrderSchema), orderController.create);
router.get('/', authenticate, authorize('CUSTOMER'), orderController.list);
router.get('/:id', authenticate, authorize('CUSTOMER'), orderController.detail);
router.patch('/:id/cancel', authenticate, authorize('CUSTOMER'), orderController.cancel);

export default router;
