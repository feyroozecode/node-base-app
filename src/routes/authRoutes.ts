import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registerValidator, loginValidator, updateProfileValidator } from '../middleware/validators';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, updateProfileValidator, authController.updateProfile);

export default router;

