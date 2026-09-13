import { Router } from 'express';
import { foodController } from '../controllers/foodController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { foodSchema } from '../validators/menu.js';

const router = Router();
router.get('/', foodController.list);
router.get('/admin/all', authenticate, authorize('ADMIN'), foodController.listAll);
router.get('/:id', foodController.byId);
router.post('/', authenticate, authorize('ADMIN'), validate(foodSchema), foodController.create);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(foodSchema.partial()), foodController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), foodController.remove);

export default router;
