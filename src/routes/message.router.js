import express from 'express';
import httpAuthMiddleware from '../middlewares/httpAuth.middleware';
import * as messageController from '../controllers/message.controller';

const router = express.Router();

router.use(httpAuthMiddleware);

router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);

export default router;
