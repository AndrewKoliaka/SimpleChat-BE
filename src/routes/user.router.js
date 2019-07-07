import express from 'express';
import httpAuthMiddleware from '../middlewares/httpAuth.middleware';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.get('/', httpAuthMiddleware, userController.getUserList);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/:id', httpAuthMiddleware, userController.updateUser);
router.delete('/:id', httpAuthMiddleware, userController.deleteUser);
router.put('/:id/block', httpAuthMiddleware, userController.blockUser);
router.put('/:id/unblock', httpAuthMiddleware, userController.unBlockUser);

export default router;
