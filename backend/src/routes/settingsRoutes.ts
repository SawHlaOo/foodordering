import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';

const router = Router();
router.get('/maintenance', settingsController.getPublicMaintenanceSettings);

export default router;
