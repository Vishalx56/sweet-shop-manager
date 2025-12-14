import { Router } from 'express';
import { createSweet, getSweets, searchSweets, updateSweet, deleteSweet } from '../controllers/sweets.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getSweets);
router.get('/search', authenticateToken, searchSweets);
router.post('/', authenticateToken, authorizeAdmin, createSweet);
router.put('/:id', authenticateToken, authorizeAdmin, updateSweet);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteSweet);

// Inventory
import { purchaseSweet, restockSweet } from '../controllers/sweets.controller';

router.post('/:id/purchase', authenticateToken, purchaseSweet);
router.post('/:id/restock', authenticateToken, authorizeAdmin, restockSweet);

export default router;
