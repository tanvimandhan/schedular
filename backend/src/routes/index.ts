import { Router } from 'express';
import slotRoutes from './slotRoutes';
import exceptionRoutes from './exceptionRoutes';

const router = Router();

// API routes
router.use('/slots', slotRoutes);
router.use('/exceptions', exceptionRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Scheduler API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;








