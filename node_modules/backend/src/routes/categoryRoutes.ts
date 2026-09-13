import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { categorySchema } from '../validators/menu.js';

const router = Router();
router.get('/', adminController.listCategories);
router.post('/', authenticate, authorize('ADMIN'), validate(categorySchema), adminController.createCategory);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(categorySchema.partial()), adminController.updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), adminController.deleteCategory);

export default router;
