import express from 'express';
import httpAuthMiddleware from '../middlewares/httpAuthMiddleware';
import * as messageController from '../controllers/messageController';

const router = express.Router();

router.use(httpAuthMiddleware);

router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);

export default router;
